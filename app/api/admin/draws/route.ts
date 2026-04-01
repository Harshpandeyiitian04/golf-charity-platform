import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { randomDraw, algorithmicDraw, checkMatch, calculatePrizePools } from '@/lib/drawEngine'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { drawType, month, simulate } = await req.json()

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Get active subscribers with scores
    const { data: subscribers } = await supabaseAdmin
      .from('profiles')
      .select('id, email, scores(*)')
      .eq('subscription_status', 'active')

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers found' }, { status: 400 })
    }

    // GET PREVIOUS UNCLAIMED JACKPOT (rollover logic)
    let jackpotCarryover = 0
    const { data: lastDraw } = await supabaseAdmin
      .from('draws')
      .select('id, total_pool, jackpot_carryover')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lastDraw) {
      const { data: lastWinners } = await supabaseAdmin
        .from('winners')
        .select('id')
        .eq('draw_id', lastDraw.id)
        .eq('match_type', '5-match')

      if (!lastWinners || lastWinners.length === 0) {
        // No 5-match winner last month — carry over jackpot
        jackpotCarryover = (lastDraw.total_pool * 0.40) + (lastDraw.jackpot_carryover || 0)
      }
    }

    const allScores = subscribers.flatMap((u: any) =>
      (u.scores || []).map((s: any) => s.score)
    )

    const drawnNumbers = drawType === 'algorithmic'
      ? algorithmicDraw(allScores)
      : randomDraw()

    const totalPool = subscribers.length * 10 * 0.60
    const pools = calculatePrizePools(totalPool, jackpotCarryover)

    const winners: any[] = []
    const entries: any[] = []

    for (const user of subscribers as any[]) {
      const userNumbers = (user.scores || []).map((s: any) => s.score)
      if (userNumbers.length === 0) continue

      const matchCount = checkMatch(drawnNumbers, userNumbers)
      entries.push({ userId: user.id, userNumbers, matchCount })

      if (matchCount === 5) {
        winners.push({ userId: user.id, email: user.email, userNumbers, matchType: '5-match', matchCount: 5, prize: pools.fiveMatch })
      } else if (matchCount === 4) {
        winners.push({ userId: user.id, email: user.email, userNumbers, matchType: '4-match', matchCount: 4, prize: pools.fourMatch })
      } else if (matchCount === 3) {
        winners.push({ userId: user.id, email: user.email, userNumbers, matchType: '3-match', matchCount: 3, prize: pools.threeMatch })
      }
    }

    const splitWinners = winners.map(w => {
      const sameType = winners.filter(x => x.matchType === w.matchType)
      return { ...w, prize: w.prize / sameType.length }
    })

    if (simulate) {
      return NextResponse.json({
        drawnNumbers, pools, winners: splitWinners,
        totalSubscribers: subscribers.length,
        jackpotCarryover, simulated: true,
      })
    }

    // PUBLISH: Save to database
    const { data: draw, error: drawError } = await supabaseAdmin
      .from('draws')
      .insert({
        month, drawn_numbers: drawnNumbers, draw_type: drawType,
        status: 'published', total_pool: totalPool,
        jackpot_carryover: jackpotCarryover,
      })
      .select().single()

    if (drawError) return NextResponse.json({ error: drawError.message }, { status: 500 })

    const entryRows = entries.map(e => ({
      draw_id: draw.id, user_id: e.userId,
      user_numbers: e.userNumbers, match_count: e.matchCount,
    }))
    await supabaseAdmin.from('draw_entries').insert(entryRows)

    if (splitWinners.length > 0) {
      const winnerRows = splitWinners.map(w => ({
        draw_id: draw.id, user_id: w.userId, match_type: w.matchType,
        prize_amount: w.prize, verification_status: 'pending', payment_status: 'pending',
      }))
      await supabaseAdmin.from('winners').insert(winnerRows)

      // Send winner email notifications
      for (const winner of splitWinners) {
        await sendEmail({
          to: winner.email,
          subject: 'GolfGives draw winner! ✅',
          text: `Congratulations! You won ${winner.matchType} with £${winner.prize.toFixed(2)}. Please upload proof to claim your prize.`,
        })
      }
    }

    // Optional rich notification for all active subscribers
    await Promise.all(subscribers.map(async (u: any) => {
      await sendEmail({
        to: u.email,
        subject: `GolfGives draw results for ${month}`,
        text: `Thanks for playing 🎉 Draw numbers: ${drawnNumbers.join(', ')}. Winners and details are posted on the platform.`,
      })
    }))

    return NextResponse.json({
      drawnNumbers, pools, winners: splitWinners,
      drawId: draw.id, jackpotCarryover, published: true,
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}