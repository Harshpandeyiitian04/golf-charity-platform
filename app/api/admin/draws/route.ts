import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  randomDraw,
  algorithmicDraw,
  checkMatch,
  calculatePrizePools,
} from "@/lib/drawEngine";

export async function POST(req: NextRequest) {
  try {
    const { drawType, month, simulate } = await req.json();

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Get all active subscribers with their scores
    const { data: subscribers } = await supabaseAdmin
      .from("profiles")
      .select("id, email, scores(*)")
      .eq("subscription_status", "active");

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers found" },
        { status: 400 },
      );
    }

    // Get all scores as flat array for algorithmic draw
    const allScores = subscribers.flatMap((u: any) =>
      (u.scores || []).map((s: any) => s.score),
    );

    // Run the draw
    const drawnNumbers =
      drawType === "algorithmic" ? algorithmicDraw(allScores) : randomDraw();

    // Calculate prize pools (£10/subscriber, 60% to prizes)
    const totalPool = subscribers.length * 10 * 0.6;
    const pools = calculatePrizePools(totalPool);

    // Check each subscriber for matches
    const winners: any[] = [];
    const entries: any[] = [];

    for (const user of subscribers as any[]) {
      const userNumbers = (user.scores || []).map((s: any) => s.score);
      if (userNumbers.length === 0) continue;

      const matchCount = checkMatch(drawnNumbers, userNumbers);
      entries.push({ userId: user.id, userNumbers, matchCount });

      if (matchCount === 5) {
        winners.push({
          userId: user.id,
          email: user.email,
          userNumbers,
          matchType: "5-match",
          matchCount: 5,
          prize: pools.fiveMatch,
        });
      } else if (matchCount === 4) {
        winners.push({
          userId: user.id,
          email: user.email,
          userNumbers,
          matchType: "4-match",
          matchCount: 4,
          prize: pools.fourMatch,
        });
      } else if (matchCount === 3) {
        winners.push({
          userId: user.id,
          email: user.email,
          userNumbers,
          matchType: "3-match",
          matchCount: 3,
          prize: pools.threeMatch,
        });
      }
    }

    // Split prizes equally among winners in same tier
    const splitWinners = winners.map((w) => {
      const sameType = winners.filter((x) => x.matchType === w.matchType);
      return { ...w, prize: w.prize / sameType.length };
    });

    // If simulation, return without saving
    if (simulate) {
      return NextResponse.json({
        drawnNumbers,
        pools,
        winners: splitWinners,
        totalSubscribers: subscribers.length,
        simulated: true,
      });
    }

    // --- PUBLISH: Save to database ---

    // 1. Create draw record
    const { data: draw, error: drawError } = await supabaseAdmin
      .from("draws")
      .insert({
        month,
        drawn_numbers: drawnNumbers,
        draw_type: drawType,
        status: "published",
        total_pool: totalPool,
      })
      .select()
      .single();

    if (drawError) {
      return NextResponse.json({ error: drawError.message }, { status: 500 });
    }

    // 2. Save draw entries
    const entryRows = entries.map((e) => ({
      draw_id: draw.id,
      user_id: e.userId,
      user_numbers: e.userNumbers,
      match_count: e.matchCount,
    }));

    await supabaseAdmin.from("draw_entries").insert(entryRows);

    // 3. Save winners
    if (splitWinners.length > 0) {
      const winnerRows = splitWinners.map((w) => ({
        draw_id: draw.id,
        user_id: w.userId,
        match_type: w.matchType,
        prize_amount: w.prize,
        verification_status: "pending",
        payment_status: "pending",
      }));
      await supabaseAdmin.from("winners").insert(winnerRows);
    }

    return NextResponse.json({
      drawnNumbers,
      pools,
      winners: splitWinners,
      drawId: draw.id,
      published: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
