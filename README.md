# Help Review Platform

A modern review and business discovery platform built for production-ready launch.

This repository contains a full-featured Next.js application with business claim workflows, review management, campaign email automation, analytics dashboards, payment verification, AI-enhanced search, and role-based access for admin, business, data-entry, and blog contributors.

## Why this project

This platform is designed for businesses that want to:

- own and verify their public profile
- manage customer reviews and reputation
- run email outreach campaigns
- monitor analytics, performance, and engagement
- accept secure payments for premium plans
- provide trusted listings to users with advanced search

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- Prisma ORM with MongoDB
- next-auth for authentication
- Cloudinary for image assets
- Resend + Nodemailer for email workflows
- Razorpay payment verification
- Google Gemini generative AI for search assistance
- Radix UI, Framer Motion, React Hook Form

## Core capabilities

- Business directory with searchable listings
- Business claim, approval, and verification workflow
- Review submissions, moderation, and ratings
- Business dashboard with analytics and lead generation
- Email campaign creation and review invite workflows
- Cloudinary-backed image management
- Paid subscription support via Razorpay
- AI-powered search experience using Gemini
- Multi-role access control: admin, business, data entry, blog entry
- MongoDB data model with Plans, Companies, Reviews, Users, Payments, Campaigns, and more

## Repository structure

- `app/` — page routes, layouts, and server actions
- `components/` — reusable UI and feature components
- `lib/` — backend service utilities, API actions, integrations
- `prisma/` — schema and seed data scripts
- `public/` — static assets and image resources
- `auth.config.ts` — authentication and route protection rules
- `next.config.ts` — production image domains and server action settings

## Getting started

### Prerequisites

- Node.js 20+
- npm
- MongoDB database
- Cloudinary account (for image uploads)
- Resend account (for transactional email)
- Razorpay account (for payment verification)
- Google Cloud or Gemini API access for AI-enhanced search

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file at the project root and provide the values below:

```env
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

SMTP_EMAIL="your-smtp-email@example.com"
SMTP_PASSWORD="your-smtp-password"
RESEND_API_KEY="resend_api_key_here"

GEMINI_API_KEY="your_google_gemini_api_key"
GROQ_API_KEY="your_groq_api_key"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"

RAZORPAY_KEY_SECRET="your_razorpay_secret"

# Optional if using NextAuth in production
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your_nextauth_secret"
```

> Note: `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are recommended for production even if they are not explicitly referenced in the current codebase.

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
npm start
```

### Seed sample data

The project includes a seed script to populate the database with starter users, companies, categories, and reviews.

```bash
npm run seed
```

## Useful scripts

- `npm run dev` — start development server
- `npm run build` — compile production build
- `npm start` — run production server
- `npm run lint` — run ESLint
- `npm run seed` — seed development data

## Deployment notes

- This app is production-ready for hosts that support Next.js and Node.js.
- Configure environment variables securely in your deployment platform.
- Ensure MongoDB is reachable from your production environment.
- Use HTTPS and a valid domain for authentication and email callbacks.

## Production considerations

- Validate all email sender credentials and domain verification for Resend.
- Use secure credentials for SMTP and Razorpay.
- Enable logging and monitoring for payment and email workflows.
- Review `next.config.ts` if you need to add additional remote image domains.

## Contributing

If you are extending this platform, consider:

- keeping UI components reusable under `components/`
- centralizing backend logic in `lib/`
- using server actions for authenticated form handling
- keeping environment-sensitive secrets out of version control

## License

This repository does not currently specify a license. Add a `LICENSE` file if you plan to publish or share this project publicly.
