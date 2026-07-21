'use client';
import { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import type { SalesData } from '@/types/ugc';

interface ManualStatsFormProps {
  currentData: SalesData | null;
  onSaved: (data: SalesData) => void;
  showStatus: (type: 'success' | 'error', text: string) => void;
}

const HIGH_REVENUE_THRESHOLD = 10_000_000;

export default function ManualStatsForm({ currentData, onSaved, showStatus }: ManualStatsFormProps) {
  const [revenue, setRevenue] = useState('');
  const [sales, setSales] = useState('');
  const [growth, setGrowth] = useState('');
  const [period, setPeriod] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFieldError(null);

    const revenueNum = Number.parseInt(revenue, 10);
    const salesNum = Number.parseInt(sales, 10);
    const growthNum = growth.trim() === '' ? 0 : Number.parseFloat(growth);

    if (!Number.isFinite(revenueNum) || revenueNum < 0 || !Number.isFinite(salesNum) || salesNum < 0) {
      setFieldError('Revenue and sales must be non-negative whole numbers.');
      return;
    }
    if (!Number.isFinite(growthNum)) {
      setFieldError('Growth must be a number (or left blank).');
      return;
    }

    if (revenueNum > HIGH_REVENUE_THRESHOLD && !needsConfirm) {
      setNeedsConfirm(true);
      return;
    }
    setNeedsConfirm(false);

    const manualData: SalesData = {
      totalRevenue: revenueNum,
      totalSales: salesNum,
      growthPercentage: growthNum,
      lastUpdated: new Date().toISOString(),
      dataPeriod: period.trim() || 'Current Period',
      topItems: currentData?.topItems || [],
    };

    setIsSaving(true);
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData),
      });

      if (response.ok) {
        onSaved(manualData);
        showStatus(
          'success',
          `Stats updated! Revenue: ${revenueNum.toLocaleString()} | Sales: ${salesNum.toLocaleString()} | Period: ${manualData.dataPeriod}`
        );
        setRevenue('');
        setSales('');
        setGrowth('');
        setPeriod('');
      } else {
        showStatus('error', 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showStatus('error', 'Failed to save data');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card flex h-full flex-col p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <PencilSquareIcon className="h-5 w-5 text-accent" />
        Quick Update
      </h3>
      <p className="mt-1 text-sm text-ink-muted">Manually enter the headline stats.</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label htmlFor="manual-revenue" className="mb-1 block text-xs font-medium text-ink-secondary">
              Total revenue (R$)
            </label>
            <input
              id="manual-revenue"
              type="number"
              min="0"
              step="1"
              required
              placeholder="100000"
              value={revenue}
              onChange={(e) => {
                setRevenue(e.target.value);
                setNeedsConfirm(false);
              }}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="manual-sales" className="mb-1 block text-xs font-medium text-ink-secondary">
              Total sales
            </label>
            <input
              id="manual-sales"
              type="number"
              min="0"
              step="1"
              required
              placeholder="5000"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="manual-growth" className="mb-1 block text-xs font-medium text-ink-secondary">
              Growth % (optional)
            </label>
            <input
              id="manual-growth"
              type="number"
              step="0.1"
              placeholder="0"
              value={growth}
              onChange={(e) => setGrowth(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="manual-period" className="mb-1 block text-xs font-medium text-ink-secondary">
              Data period
            </label>
            <input
              id="manual-period"
              type="text"
              placeholder="March 2026"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {fieldError && <p className="text-sm text-danger">{fieldError}</p>}

        {needsConfirm && (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
            Revenue of {Number.parseInt(revenue, 10).toLocaleString()} seems very high. Press save
            again to confirm.
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary mt-auto w-full text-sm disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : needsConfirm ? 'Confirm & Save' : 'Save Stats'}
        </button>
      </form>
    </div>
  );
}
