'use client';
import {
  BanknotesIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import type { SalesData } from '@/types/ugc';

const formatUpdated = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function StatsSummary({ salesData }: { salesData: SalesData | null }) {
  if (!salesData) return null;

  const growthPositive = salesData.growthPercentage > 0;
  const growthNegative = salesData.growthPercentage < 0;
  const updated = formatUpdated(salesData.lastUpdated);

  const tiles = [
    {
      label: 'Revenue (R$)',
      value: salesData.totalRevenue.toLocaleString('en-GB'),
      valueClass: 'text-ink',
      Icon: BanknotesIcon,
      chip: 'bg-accent-soft',
      iconClass: 'text-accent',
    },
    {
      label: 'Sales',
      value: salesData.totalSales.toLocaleString('en-GB'),
      valueClass: 'text-ink',
      Icon: ShoppingBagIcon,
      chip: 'bg-blue-soft',
      iconClass: 'text-brand-blue',
    },
    {
      label: 'Growth',
      value: `${growthPositive ? '+' : ''}${salesData.growthPercentage}%`,
      valueClass: growthPositive ? 'text-success' : growthNegative ? 'text-danger' : 'text-ink',
      Icon: ChartBarIcon,
      chip: 'bg-cyan-soft',
      iconClass: 'text-brand-cyan-deep',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <div key={tile.label} className="card flex items-center gap-4 p-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tile.chip}`}>
              <tile.Icon className={`h-5 w-5 ${tile.iconClass}`} />
            </div>
            <div className="min-w-0">
              <div className={`truncate text-2xl font-semibold tabular-nums ${tile.valueClass}`}>
                {tile.value}
              </div>
              <div className="text-xs font-medium text-ink-muted">{tile.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-lg border border-line bg-surface px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2 text-sm text-ink-secondary">
          <CalendarIcon className="h-4 w-4 shrink-0 text-ink-muted" />
          <span className="truncate" title={salesData.dataPeriod}>
            {salesData.dataPeriod || 'Current period'}
          </span>
        </span>
        {updated && <span className="shrink-0 text-xs text-ink-muted">Updated {updated}</span>}
      </div>
    </div>
  );
}
