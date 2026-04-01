# GolfGives (Golf Charity Subscription Platform)

**For:** Harsh Pandey

## Project Summary
GolfGives is a subscription-based golf performance tracking and charity draw platform.
Users subscribe, enter Stableford scores, participate in monthly prize draws, and route a portion of membership fees to charities. Admins manage users, charities, draws, winner verification, and payouts.

## Key Features Implemented
- Email/password auth via Supabase
- Stripe monthly/yearly billing and webhook-based subscription state updates
- Score entry with 1–45 validation and latest-5 rolling retention (auto-delete oldest)
- User dashboard (subscription status, scores, charity, draws, wins)
- Charity selection at signup + percentage contribution
- Charity listing/search + admin charity management
- One-time donation flow
- Draw engine: random + algorithmic, simulation + publish
- Winner evaluation: 5/4/3 match tiers, split winners, jackpot rollover
- Winner proof upload, admin approve/reject, mark paid
- Email notifications: draw results, winners, verification updates
- Light UI/UX with modern dark theme + mobile support

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Supabase (auth, db, storage)
- Stripe (payments)
- Tailwind CSS
- React
- Nodemailer (SMTP for email)
- Vitest (unit tests)

## Project Structure Highlights
- `app/(auth)` - login/signup
- `app/(dashboard)` - user dashboard, scores, charity, draws
- `app/(admin)` - admin users/draws/charities/winners
- `app/api/admin/draws` - draw simulation/publish
- `app/api/stripe/checkout`, `app/api/stripe/webhook` - Stripe flow
- `lib/drawEngine.ts` - draw and prize logic
- `lib/email.ts` - email templates and send function

## Local Setup
```bash
npm install
cp .env.local.example .env.local
```
Fill `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_*` keys and price IDs
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

Run app:
```bash
npm run dev
```

Open `http://localhost:3000`.

## Tests
```bash
npm test
```

## Deployment
1. Create new Supabase project and new Vercel project.
2. Run migrations / ensure schema has required columns:
   - `draws.jackpot_carryover`, `draws.total_pool`
   - `profiles.charity_id`, `profiles.charity_percentage`
3. Set Vercel environment variables (same as `.env.local`).
4. Deploy on Vercel.

## SMTP Setup
- Provider: SendGrid, Gmail (app password), Mailgun, etc.
- Required env:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Optional test endpoint: `/api/test-email`

## Known Issues / Next Improvements
- Add full server-side RLS policy + API role checks
- Add background queue for email sending (avoid request delays)
- Add interactive draw history graph and analytics (admin)
- Add full E2E tests for flows (Cypress/Playwright)
- Add offline/slow network resilience and retry for Supabase calls

## Security Checklist
- Do not commit `.env.local` or secrets
- Use Vercel secret management for production keys
- Rotate keys regularly

## 100% Criteria (checklist)
- [x] User signup/login
- [x] Subscription flow (monthly/yearly)
- [x] Score entry, 5-score rolling
- [x] Draw/edit simulation/publish
- [x] Jackpot rollover
- [x] Charity selection/contrib
- [x] Winner verify + pay
- [x] Email notifications (draw/winner/verification)
- [x] Unit tests + CI (Vitest)
- [x] Mobile/responsive UI


---

This repository is ready for final review and submission.
By Harsh Pandey
