# ItsCoreyE - Portfolio Website

![ItsCoreyE Banner](public/og-image.png)

Professional portfolio website for ItsCoreyE - Entrepreneur & Creator. Showcasing four ventures: Roblox UGC Creation, Odds Up (Prize Competitions), Fix My Rig (IT Support), and Click The Otter (Idle Clicker Game).

🌐 **Live Site:** [www.itscoreye.com](https://www.itscoreye.com)

## 🚀 About

This portfolio website showcases ItsCoreyE's entrepreneurial journey and active ventures with a focus on transparency and real-time metrics. Built with modern web technologies for optimal performance and user experience.

### Featured Ventures

- **ItsCoreyE UGC** - Roblox UGC Creator building quality digital items
- **Odds Up** - Fair prize competition platform with realistic odds (Coming Soon)
- **Fix My Rig** - Remote IT support service providing expert tech assistance (Coming Soon)
- **Click The Otter** - Free browser-based idle clicker game (Live at [www.clicktheotter.com](https://www.clicktheotter.com))

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Heroicons, Radix UI Icons, Lucide React
- **Storage:** Upstash Redis
- **Build Tool:** Turbopack

## ✨ Features

- 🎨 Modern, responsive design with purple-cyan gradient theme
- 📱 Fully optimized for mobile devices
- 📊 Real-time Roblox UGC statistics integration
- 🎯 Live milestone tracking with Discord webhooks
- 🔐 Protected admin panel for content management
- ⚡ Performance-optimized with lazy loading
- 🌐 SEO-ready with proper metadata and sitemap
- 🎭 Smooth animations and transitions
- 📈 Schema.org structured data for rich search results
- 💎 Automated weekly Rolimons inventory value tracking via Discord

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

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

3. Create a `.env.local` file with required environment variables:
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

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
itscoreye-website/
├── public/                  # Static assets
│   ├── icons/              # Favicon and app icons
│   ├── og-image.png        # Social media preview image
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   │   ├── admin/      # Authentication (verify, logout)
│   │   │   ├── data/       # UGC sales data
│   │   │   ├── discord/    # Discord webhooks (milestone, csv-stats)
│   │   │   ├── milestones/ # Milestone tracking
│   │   │   ├── roblox/     # Roblox thumbnail fetching
│   │   │   └── rolimons/   # Weekly value tracking (cron-triggered)
│   │   ├── admin/          # Admin panel page
│   │   ├── layout.tsx      # Root layout with SEO metadata
│   │   ├── page.tsx        # Homepage
│   │   └── globals.css     # Global styles and Tailwind
│   ├── components/         # React components
│   │   ├── admin/          # Admin-specific components
│   │   └── ...             # Main site components
│   ├── hooks/              # Custom React hooks
│   └── lib/
│       └── server/         # Server-side utilities
└── ...
```

## 🎯 Key Components

- **Navigation** - Sticky navigation bar
- **Hero** - Landing section with gradient branding
- **VenturesOverview** - Four venture cards with live status
- **LiveStats** - Real-time Roblox UGC metrics
- **FeaturedItems** - Showcase of best-selling UGC items
- **MilestonesSection** - Achievement timeline
- **AboutSection** - Professional background and skills
- **Contact** - Multi-channel contact options
- **Footer** - Site footer

## 🔧 Configuration

### Environment Variables

- `ADMIN_PASSWORD` - Password for admin panel access
- `DISCORD_WEBHOOK_URL` - Discord webhook for milestone notifications (also used as fallback for other webhooks)
- `DISCORD_PING_ROLE_ID` - (Optional) role ID to ping for milestone notifications
- `DISCORD_CSV_WEBHOOK_URL` - (Optional) dedicated Discord webhook for monthly CSV/growth notifications
- `DISCORD_CSV_PING_ROLE_ID` - (Optional) role ID to ping for monthly CSV/growth notifications
- `CRON_SECRET` - Bearer token for authenticating external cron requests (cron-job.org)
- `DISCORD_ROLIMONS_WEBHOOK_URL` - (Optional) dedicated Discord webhook for weekly Rolimons value updates (falls back to `DISCORD_WEBHOOK_URL`)
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token

### Metadata Configuration

SEO and social media metadata can be updated in `src/app/layout.tsx`:
- Page titles and descriptions
- OpenGraph and Twitter Card settings
- Structured data (Schema.org)

## 📱 Mobile Optimization

- Hero section: 70vh on mobile, 75vh on larger screens
- Section padding: 2.5rem mobile → 4rem tablet → 5rem desktop
- Responsive typography scaling
- Touch-friendly button sizes (44px minimum)
- Progressive grid breakpoints (1 col → 2 col → 3 col)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The site can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## 🤝 Contributing

This is a personal portfolio website. For bug reports or suggestions, please open an issue on GitHub.

## 📄 License

© 2026 ItsCoreyE. All rights reserved.

## 🔗 Links

- **Website:** [www.itscoreye.com](https://www.itscoreye.com)
- **Roblox:** [@ItsCoreyE](https://www.roblox.com/users/3504185/profile)
- **TikTok:** [@itscoreye](https://www.tiktok.com/@itscoreye)
- **Discord:** [Join Server](https://discord.gg/nbQArRaq8m)

---

Built with ❤️ by ItsCoreyE
