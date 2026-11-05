import {
  TrophyIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export type VentureStatus = 'Live' | 'Coming Soon';
export type VentureAccent = 'blue' | 'cyan' | 'emerald';

export interface Venture {
  id: string;
  Icon: typeof TrophyIcon;
  name: string;
  tagline: string; // plain-English "what it is", read at a glance
  description: string;
  status: VentureStatus;
  accent: VentureAccent;
  founded: string;
  href: string;
  domain: string;
}

// The Roblox UGC brand is rendered separately as the featured tile; these are
// the other businesses. Keep layout.tsx structured data in step with this list.
export const ventures: Venture[] = [
  {
    id: 'oddsup',
    Icon: TrophyIcon,
    name: 'Odds Up',
    tagline: 'UK Prize Competitions',
    description: 'Fair prize competitions with realistic odds and transparent prizes, so you always know what you are entering.',
    status: 'Live',
    accent: 'blue',
    founded: 'Dec 2025',
    href: 'https://www.oddsup.co.uk',
    domain: 'oddsup.co.uk',
  },
  {
    id: 'muzzle',
    Icon: ShieldCheckIcon,
    name: 'Muzzle',
    tagline: "Moderation Bot for Yapin'",
    description: "A free moderation bot for Yapin' servers with automod, raid protection and a staff dashboard.",
    status: 'Live',
    accent: 'emerald',
    founded: 'Nov 2026',
    href: 'https://getmuzzle.tech',
    domain: 'getmuzzle.tech',
  },
  {
    id: 'fixmyrig',
    Icon: ComputerDesktopIcon,
    name: 'Fix My Rig',
    tagline: 'Remote IT Support',
    description: 'Expert remote tech support for PC and software problems, from anywhere in the world.',
    status: 'Coming Soon',
    accent: 'cyan',
    founded: 'Feb 2025',
    href: 'https://www.fixmyrig.co.uk',
    domain: 'fixmyrig.co.uk',
  },
];

// The UGC brand counts as a live venture alongside the list above.
export const ventureCount = ventures.length + 1;
export const liveVentureCount = ventures.filter((v) => v.status === 'Live').length + 1;
