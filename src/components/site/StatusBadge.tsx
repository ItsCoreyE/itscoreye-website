export type StatusTone = 'live' | 'soon' | 'progress' | 'done';

// Full literal class strings: Tailwind's scanner cannot see interpolated names
const tones: Record<StatusTone, { pill: string; dot: string; pulse: boolean }> = {
  live: { pill: 'border-emerald-border bg-success-soft text-success', dot: 'bg-success', pulse: true },
  soon: { pill: 'border-line bg-surface-muted text-ink-muted', dot: 'bg-ink-muted/60', pulse: false },
  progress: { pill: 'border-accent-border bg-accent-soft text-accent', dot: 'bg-accent', pulse: false },
  done: { pill: 'border-emerald-border bg-success-soft text-success', dot: 'bg-success', pulse: false },
};

// Small status pill used on venture tiles and the verification card, so every
// status reads the same way: coloured dot, short Title Case label.
export default function StatusBadge({ tone, children }: { tone: StatusTone; children: React.ReactNode }) {
  const style = tones[tone];
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap ${style.pill}`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${style.dot} ${style.pulse ? 'animate-pulse' : ''}`} />
      {children}
    </span>
  );
}
