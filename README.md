# ItsCoreyE - Portfolio Website

Personal portfolio website for Corey Edwards (ItsCoreyE), Entrepreneur & Creator. Showcases four ventures: Roblox UGC creation, Odds Up (prize competitions), Fix My Rig (IT support), and Click The Otter (idle clicker game), backed by live sales statistics and milestone tracking.

**Live site:** [www.itscoreye.com](https://www.itscoreye.com)

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration)
- **Icons:** Heroicons
- **Storage:** Upstash Redis
- **Dev server:** Turbopack

## Features

- Server-rendered homepage: sales stats and milestone progress are fetched from Redis on the server and cached, with on-demand revalidation when the admin saves new data
- Light theme built around the CE brand gradient (purple, blue, cyan) with an accessible neutral base
- Live Roblox UGC statistics: revenue, sales, best-selling items with thumbnails
- Milestone tracking across five categories with Discord notifications on completion
- Password-protected admin panel: manual stat entry, monthly CSV upload, growth calculation between months, and milestone management
- Weekly Rolimons inventory value tracking posted to Discord via external cron
- SEO metadata, OpenGraph/Twitter cards, and Schema.org structured data

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ItsCoreyE/itscoreye-website.git
cd itscoreye-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with the required environment variables:
```env
ADMIN_PASSWORD=your_admin_password
DISCORD_WEBHOOK_URL=your_discord_webhook_url
DISCORD_PING_ROLE_ID=your_milestone_ping_role_id
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
CRON_SECRET=your_cron_secret

# Optional: dedicated webhooks per feature
DISCORD_CSV_WEBHOOK_URL=your_csv_discord_webhook_url
DISCORD_CSV_PING_ROLE_ID=your_discord_role_id
DISCORD_ROLIMONS_WEBHOOK_URL=your_rolimons_webhook_url
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
itscoreye-website/
├── public/
│   ├── icons/              # Favicons and app icons
│   ├── og-image.png        # Social media preview image
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/      # Authentication (verify, logout)
│   │   │   ├── data/       # UGC sales data (GET/POST)
│   │   │   ├── discord/    # Discord webhooks (milestone, csv-stats)
│   │   │   ├── milestones/ # Milestone tracking (GET/POST)
│   │   │   ├── roblox/     # Roblox thumbnail proxy (single and batched)
│   │   │   └── rolimons/   # Weekly value tracking (cron-triggered)
│   │   ├── admin/          # Admin panel page
│   │   ├── layout.tsx      # Root layout with SEO metadata
│   │   ├── page.tsx        # Homepage (Server Component)
│   │   └── globals.css     # Design tokens and global styles
│   ├── components/
│   │   ├── site/           # Public homepage sections
│   │   └── admin/          # Admin panel components
│   ├── lib/                # Shared helpers (CSV parsing, milestones, validation)
│   │   └── server/         # Server-only utilities (Redis, Discord, auth)
│   └── types/              # Shared TypeScript types
└── ...
```

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Admin panel access |
| `DISCORD_WEBHOOK_URL` | Yes | Milestone notifications (fallback for all webhooks) |
| `DISCORD_PING_ROLE_ID` | No | Role pinged on milestone notifications |
| `DISCORD_CSV_WEBHOOK_URL` | No | Dedicated webhook for monthly CSV/growth updates |
| `DISCORD_CSV_PING_ROLE_ID` | No | Role pinged on CSV/growth updates |
| `DISCORD_ROLIMONS_WEBHOOK_URL` | No | Dedicated webhook for weekly Rolimons updates |
| `CRON_SECRET` | Yes | Bearer token for the external cron endpoint |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis token |

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add the environment variables
4. Deploy

The site also runs on any platform supporting Next.js (Netlify, Railway, AWS Amplify, or self-hosted Node.js).

## Licence

© 2026 ItsCoreyE. All rights reserved.

## Links

- **Website:** [www.itscoreye.com](https://www.itscoreye.com)
- **Roblox:** [@ItsCoreyE](https://www.roblox.com/users/3504185/profile)
- **TikTok:** [@itscoreye](https://www.tiktok.com/@itscoreye)
- **Discord:** [Join Server](https://discord.gg/itscoreye)
