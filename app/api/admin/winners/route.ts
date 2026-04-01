import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function PATCH(req: NextRequest) {
  try {
    const { id, verification_status } = await req.json()

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data: winner, error: winnerError } = await supabaseAdmin
      .from('winners')
      .select('*, profiles(full_name, email)')
      .eq('id', id)
      .single()

    if (winnerError || !winner) {
      return NextResponse.json({ error: (winnerError?.message || 'Winner not found') }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('winners')
      .update({ verification_status })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    const email = winner.profiles?.email
    const fullName = winner.profiles?.full_name || 'Golfer'
    if (email) {
      const tpl = emailTemplates.verificationUpdate(fullName, verification_status, winner.prize_amount)
      await sendEmail({ to: email, ...tpl })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
