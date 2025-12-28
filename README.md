# Interview Accelerator

A 14-day structured job search program built with Next.js, Prisma, and Resend.

## Features

- **14-Day Guided Program**: Step-by-step daily tasks (30 min each)
- **Career Profile Builder**: Document skills, experience, accomplishments
- **Job Tracker**: Save jobs with automatic match scoring
- **Networking Tracker**: Track contacts at each company
- **STAR Story Builder**: Prepare for behavioral interviews
- **AI-Powered Features** (Pro/Premium): Resume rewriting, coaching
- **Magic Link Auth**: Passwordless login via Resend

## Pricing Tiers (Sold on Stan Store)

| Tier | Price | Access | AI Features |
|------|-------|--------|-------------|
| Starter | $149 | 14 days | ❌ |
| Pro | $399 | 30 days | ✅ |
| Premium | $599 | 365 days | ✅ + extras |

## How It Works

1. User purchases on Stan Store
2. Stan delivers PDF with activation code
3. User visits /activate and enters code
4. User enters email → magic link sent via Resend
5. User clicks link → logged in and ready to go

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js + Magic Links
- **Email**: Resend
- **AI**: OpenAI (Pro/Premium tiers)
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Clone and Install

```bash
cd interview-accelerator
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret (run `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `RESEND_API_KEY` - From Resend dashboard
- `EMAIL_FROM` - Your verified sender email
- `ACTIVATION_CODE_STARTER` - Master code for $149 tier
- `ACTIVATION_CODE_PRO` - Master code for $399 tier  
- `ACTIVATION_CODE_PREMIUM` - Master code for $599 tier
- `OPENAI_API_KEY` - For AI features (optional for Starter tier)

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 4. Stan Store Setup

1. Create 3 products on Stan Store (Starter $149, Pro $399, Premium $599)
2. For each product, upload the corresponding PDF from `/pdfs` folder:
   - `STARTER-activation-guide.md` → Convert to PDF → Upload to Starter product
   - `PRO-activation-guide.md` → Convert to PDF → Upload to Pro product
   - `PREMIUM-activation-guide.md` → Convert to PDF → Upload to Premium product
3. Make sure the activation codes in the PDFs match your `.env` file

### 5. Resend Setup

1. Create account at resend.com
2. Verify your domain
3. Get API key and add to `.env`
4. Set `EMAIL_FROM` to your verified sender

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   └── auth/               # Auth routes
│   │       ├── [...nextauth]/  # NextAuth handler
│   │       ├── activate/       # Create account with code
│   │       ├── send-magic-link/# Login for existing users
│   │       └── validate-code/  # Check activation code
│   ├── activate/               # Activation page (enter code)
│   ├── auth/
│   │   ├── check-email/        # "Check your email" page
│   │   └── verify/             # Magic link landing
│   ├── dashboard/              # Main app (protected)
│   │   ├── day/[dayNumber]/    # Daily task pages
│   │   ├── jobs/               # Job tracker
│   │   ├── networking/         # Contact tracker
│   │   └── profile/            # Career profile view
│   ├── login/                  # Magic link login
│   └── page.tsx                # Landing page
├── components/
│   ├── DashboardNav.tsx
│   └── Providers.tsx
├── lib/
│   ├── activation.ts           # Master code validation
│   ├── auth.ts                 # NextAuth config
│   ├── constants.ts            # 14-day program data
│   ├── email.ts                # Resend email functions
│   ├── prisma.ts               # Database client
│   └── utils.ts                # Helper functions
├── types/
│   └── next-auth.d.ts          # Type extensions
pdfs/
├── STARTER-activation-guide.md # Convert to PDF for Stan Store
├── PRO-activation-guide.md
└── PREMIUM-activation-guide.md
```

## Key Features to Build

### Completed ✅
- [x] Project scaffolding
- [x] Prisma schema with all models
- [x] Magic link auth (Resend)
- [x] Activation code system (master codes per tier)
- [x] Landing page with Stan Store links
- [x] Login flow (magic link)
- [x] Activate flow (code → email → magic link)
- [x] Dashboard layout with navigation
- [x] Day progression system
- [x] Day 1 page (Career Profile)
- [x] API routes for core data
- [x] PDF templates for Stan Store

### To Build 🔨
- [ ] Day 2 page (Career Preferences with weights)
- [ ] Day 3 page (Job finder with match scores)
- [ ] Job tracker dashboard
- [ ] Day 4-5 pages (Resume + LinkedIn)
- [ ] Day 6-7 pages (Networking setup)
- [ ] Day 8-11 pages (Applications + Outreach)
- [ ] Day 12-13 pages (STAR stories + Practice)
- [ ] Day 14 page (Follow-up)
- [ ] Networking contacts dashboard
- [ ] AI integration for Pro/Premium
- [ ] Read-only mode after expiration
- [ ] Premium bonus content (salary negotiation, first 90 days, weekly wins)

## License

Private - All rights reserved
