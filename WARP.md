# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```pwsh
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

The development server runs on http://localhost:3000

### Environment Setup
Required environment variables in `.env.local`:
- `ADMIN_PASSWORD` - Password for admin panel authentication
- `DISCORD_WEBHOOK_URL` - Discord webhook for milestone notifications
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL (automatically set by Vercel)
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token (automatically set by Vercel)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Heroicons, Radix UI Icons, Lucide React
- **Storage**: Upstash Redis (for milestone and sales data persistence)
- **Build Tool**: Turbopack (dev server)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin authentication
│   │   ├── data/          # UGC sales data (GET/POST to Upstash)
│   │   ├── discord/       # Discord webhook integrations
│   │   ├── milestones/    # Milestone management (GET/POST to Upstash)
│   │   └── roblox/        # Roblox thumbnail fetching
│   ├── admin/             # Admin panel page
│   ├── layout.tsx         # Root layout with SEO metadata
│   ├── page.tsx           # Homepage with all sections
│   └── globals.css        # Global styles and Tailwind
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   │   ├── AdminPanel.tsx # Main admin interface (auth, data upload)
│   │   └── MilestoneAdmin.tsx # Milestone management UI
│   ├── Hero.tsx           # Landing section
│   ├── VenturesOverview.tsx # Three venture cards
│   ├── LiveStats.tsx      # Real-time Roblox UGC metrics
│   ├── FeaturedItems.tsx  # Showcase of top items
│   ├── MilestonesSection.tsx # Achievement timeline
│   ├── AboutSection.tsx   # Professional background
│   └── Contact.tsx        # Contact options
└── hooks/
    └── usePerformanceMode.ts # Responsive animation optimization
```

### Data Flow Architecture

**Storage Pattern**: This application uses Upstash Redis as the primary data store for persistent data (milestones and sales statistics), not localStorage.

**Sales Data Flow**:
1. Admin uploads CSV via AdminPanel (`/admin`)
2. AdminPanel processes CSV and fetches Roblox thumbnails
3. Data is POSTed to `/api/data` which saves to Upstash Redis
4. LiveStats component fetches from `/api/data` (GETs from Upstash)
5. Discord webhook triggered on CSV upload

**Milestones Data Flow**:
1. Admin updates milestones via MilestoneAdmin component
2. Data is POSTed to `/api/milestones` which saves to Upstash Redis
3. On new completion, automatic Discord notification sent
4. MilestonesSection fetches from `/api/milestones` (GETs from Upstash)

**Key API Routes**:
- `/api/data` - GET/POST UGC sales data (Upstash Redis: `ugc-sales-data` key)
- `/api/milestones` - GET/POST milestone tracking (Upstash Redis: `ugc-milestones` key)
- `/api/roblox` - Fetch Roblox asset thumbnails via query param `?assetId=123`
- `/api/admin/verify` - Password authentication (uses ADMIN_PASSWORD env var)
- `/api/discord/milestone-webhook` - Sends milestone completion notifications
- `/api/discord/csv-stats-webhook` - Sends sales data update notifications

### Component Architecture

**Client vs Server Components**:
- `layout.tsx` is a Server Component (handles SEO metadata)
- `page.tsx` and all interactive components are Client Components (marked with `'use client'`)
- All components use Framer Motion for animations

**Performance Optimization**:
- `usePerformanceMode` hook detects mobile devices and reduces animation complexity
- Animations are disabled when user prefers reduced motion
- Hover effects disabled on touch devices
- Mobile: shorter animation durations, no complex animations
- Desktop: full animation effects enabled

**Admin Panel**:
- Protected by password authentication via `/api/admin/verify`
- Two upload modes:
  1. Single CSV upload: processes current month data with full thumbnails
  2. Growth calculation mode: compares two CSV files (previous vs current month)
- Automatically fetches Roblox thumbnails for featured items
- Triggers Discord webhooks on data updates

### Milestone System

The milestone system tracks 4 categories:
1. **Revenue** - Robux earnings (15 milestones: 1K → 10M)
2. **Sales** - Total item sales (15 milestones: 100 → 1M)
3. **Items** - Published UGC items (15 milestones: 1 → 3000)
4. **Collectibles** - Personal Roblox Limited items (12 milestones with asset IDs)
5. **Verification** - Roblox Verified Creator status (1 milestone)

Default milestones are defined in `/api/milestones/route.ts`. The API automatically migrates existing data when new milestones are added or collectible names are updated.

### SEO & Metadata

All metadata is configured in `app/layout.tsx`:
- OpenGraph and Twitter Card images
- Schema.org structured data (Person type with Organization relationships)
- Viewport settings optimized for mobile
- Sitemap and robots.txt in `/public`

### Styling

**Design System**:
- Purple-cyan gradient theme (`modern-gradient-bg` class)
- Glass-morphism effects on cards and buttons
- Responsive section padding: `section-padding` class (2rem mobile, 5rem desktop)
- Custom gradient text: `gradient-text` class
- Modern button styling: `modern-button` class

**Mobile Optimization**:
- Hero section: 40vh on mobile, 50vh+ on larger screens
- Touch-friendly button sizes (44px minimum)
- Responsive typography scaling via Tailwind
- Stack layouts on mobile, row layouts on desktop

### Path Aliases

TypeScript path alias configured in `tsconfig.json`:
- `@/*` maps to `./src/*`
- Always use this alias for imports: `import Component from '@/components/Component'`

## Development Guidelines

### When Working with Data
- Never hardcode sales data or milestones in components
- Always fetch from `/api/data` or `/api/milestones`
- Upstash Redis is the source of truth, not localStorage
- Use Redis.fromEnv() to initialize Upstash client in API routes

### When Adding New Features
- Use `'use client'` directive for interactive components
- Implement responsive design (mobile-first approach)
- Use the `usePerformanceMode` hook for animation-heavy components
- Follow existing Framer Motion patterns for consistency
- Add proper TypeScript types (avoid `any`)

### When Modifying Milestones
- Update the `defaultMilestones` array in `/api/milestones/route.ts`
- The API will automatically migrate existing data
- Collectible milestones must include `assetId` for thumbnail fetching
- Discord notifications automatically sent when milestones are marked complete

### When Working with Roblox API
- Use the `/api/roblox` route to fetch thumbnails (includes rate limiting)
- Thumbnail endpoint: `https://thumbnails.roblox.com/v1/assets?assetIds=ID&size=420x420`
- Always clean asset IDs (remove non-numeric characters)
- Handle placeholder images gracefully

### CSV Processing
- CSV format expected: columns include item name, sales, revenue, price, assetId, assetType
- Featured items are automatically sorted by revenue (top 6 displayed)
- Thumbnails are fetched during CSV processing (async, includes delays for rate limiting)
- Growth calculation compares two CSV files and calculates percentage change

### Discord Integration
- Milestone webhook triggers when marking milestones complete (includes progress stats)
- CSV stats webhook triggers after successful CSV upload
- Both use embeds with specific color schemes and formatting
