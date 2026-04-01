import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to, subject, text, html,
}: { to: string; subject: string; text?: string; html?: string }) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'GolfGives <no-reply@golfgives.com>',
      to,
      subject,
      text,
      html,
    })
  } catch (err) {
    console.error('Email send error:', err)
  }
}

export const emailTemplates = {
  winnerAlert: (name: string, matchType: string, prize: number) => ({
    subject: '🏆 You Won a GolfGives Draw!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:16px">
        <h1 style="color:#22c55e">Congratulations, ${name}!</h1>
        <p style="color:#9ca3af">You matched ${matchType} in this month's GolfGives draw.</p>
        <div style="background:#1a1a1a;border-radius:12px;padding:24px;margin:24px 0">
          <div style="font-size:32px;font-weight:900;color:#eab308">£${prize.toFixed(2)}</div>
          <div style="color:#6b7280;font-size:14px">Prize Amount</div>
        </div>
        <p style="color:#9ca3af">Log in and upload your proof screenshot to claim your prize.</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/draws" style="display:inline-block;background:#22c55e;color:#000;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none;margin-top:16px">Claim Prize →</a>
      </div>
    `,
  }),

  drawPublished: (month: string, drawnNumbers: number[]) => ({
    subject: `GolfGives Draw Results — ${month}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:16px">
        <h1 style="color:#eab308">🎱 Draw Results — ${month}</h1>
        <p style="color:#9ca3af">This month's winning numbers have been drawn.</p>
        <div style="display:flex;gap:12px;margin:24px 0">
          ${drawnNumbers.map(n => `<div style="width:48px;height:48px;border-radius:50%;background:#eab308;color:#000;font-weight:900;font-size:18px;display:flex;align-items:center;justify-content:center">${n}</div>`).join('')}
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/draws" style="display:inline-block;background:#22c55e;color:#000;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none">Check Your Results →</a>
      </div>
    `,
  }),

  verificationUpdate: (name: string, status: string, prize: number) => ({
    subject: `Your GolfGives Prize Verification — ${status}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:16px">
        <h1 style="color:${status === 'approved' ? '#22c55e' : '#ef4444'}">${status === 'approved' ? '✅ Verification Approved!' : '❌ Verification Rejected'}</h1>
        <p style="color:#9ca3af">Hi ${name}, your winner verification has been ${status}.</p>
        ${status === 'approved' ? `<p style="color:#9ca3af">Your prize of <strong style="color:#eab308">£${prize.toFixed(2)}</strong> will be paid shortly.</p>` : '<p style="color:#9ca3af">Please contact support if you believe this is an error.</p>'}
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/draws" style="display:inline-block;background:#22c55e;color:#000;font-weight:700;padding:12px 28px;border-radius:12px;text-decoration:none;margin-top:16px">View Dashboard →</a>
      </div>
    `,
  }),
}