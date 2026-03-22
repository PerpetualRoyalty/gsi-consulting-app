# Good Samaritan Institute — Consulting Platform

A full-stack consulting platform built with Next.js 14, Stripe, and Prisma.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npx prisma generate
npx prisma db push

# 3. Seed with demo data
node prisma/seed.js

# 4. Start development server
npm run dev
```

Open http://localhost:3000

## Demo Accounts

| Role   | Email                              | Password |
|--------|------------------------------------|----------|
| Admin  | doug@goodsamaritaninstitute.org    | admin123 |
| Client | sarah@techventures.com             | client123|
| Client | mike@digitaldynamics.co            | client123|
| Client | jennifer@cloudnine.io              | client123|

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Copy your API keys from the Stripe Dashboard
3. Update `.env` with your real keys:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

4. For webhooks (local dev), install the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Features

### Admin Portal (/admin)
- **Dashboard** — Revenue stats, activity feed, quick actions
- **Clients** — Add/manage client accounts
- **Agreements** — Create retainer, project, or custom agreements with built-in IT consulting templates
- **Payments** — Track invoices, mark payments, send reminders
- **Messages** — Real-time messaging with clients
- **Documents** — Upload and share deliverables
- **Settings** — Company profile, notifications, security

### Client Portal (/dashboard)
- **Dashboard** — Agreement summaries, payment status, messages
- **Agreements** — View agreements, e-sign with canvas signature pad
- **Payments** — Pay retainers via Stripe, view history
- **Messages** — Direct communication with consultant
- **Documents** — Access shared files, upload documents
- **Profile** — Update contact info, change password

### Payment Types
- Monthly/quarterly/annual recurring retainers (Stripe Subscriptions)
- One-time project payments (Stripe Checkout)
- Custom milestone billing

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma + SQLite (swap to PostgreSQL for production)
- **Auth:** NextAuth.js with credentials provider
- **Payments:** Stripe (Checkout, Subscriptions, Webhooks)
- **Styling:** Tailwind CSS with custom brand theme
- **Icons:** React Icons (Heroicons)

## Deploying to Vercel

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables (use a PostgreSQL URL for DATABASE_URL)
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard pages
│   ├── dashboard/      # Client portal pages
│   ├── api/            # API routes (auth, agreements, payments, etc.)
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── page.js         # Landing page
├── lib/
│   ├── auth.js         # NextAuth config
│   ├── prisma.js       # Database client
│   ├── stripe.js       # Stripe client
│   └── utils.js        # Utility functions
└── middleware.js        # Route protection
```
