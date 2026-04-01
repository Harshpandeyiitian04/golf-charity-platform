import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, fullName, drawMonth, matchType, prizeAmount, verificationStatus } = await req.json()

    const subject = `GolfGives Winner Update: ${matchType} (${drawMonth})`
    const text = `Hello ${fullName || ''},\n\nYour ${matchType} prize for ${drawMonth} is now ${verificationStatus}. Prize amount: £${Number(prizeAmount).toFixed(2)}.\n\nPlease sign in to your dashboard to review and upload proof if needed.\n\nThank you for playing,\nGolfGives Team` 

    await sendEmail({ to: email, subject, text })

    return NextResponse.json({ success: true })
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
