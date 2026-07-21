'use client';
import { useRef, useState } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { processSalesCsv, summarizeSalesCsv } from '@/lib/csv';
import { attachThumbnails } from '@/lib/thumbnails';
import type { SalesData } from '@/types/ugc';

interface GrowthCalcCardProps {
  onSaved: (data: SalesData) => void;
  showStatus: (type: 'success' | 'error', text: string) => void;
}

export default function GrowthCalcCard({ onSaved, showStatus }: GrowthCalcCardProps) {
  const previousFileRef = useRef<HTMLInputElement>(null);
  const currentFileRef = useRef<HTMLInputElement>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleGrowthCalculation = async () => {
    const previousFile = previousFileRef.current?.files?.[0];
    const currentFile = currentFileRef.current?.files?.[0];

    if (!previousFile || !currentFile) {
      showStatus('error', 'Please select both previous month and current month CSV files');
      return;
    }

    setIsCalculating(true);
    try {
      const previousData = summarizeSalesCsv(await previousFile.text(), 'Previous Month');
      const processed = processSalesCsv(await currentFile.text());
      const topItems = await attachThumbnails(processed.topItems);

      const revenueGrowth =
        previousData.totalRevenue > 0
          ? ((processed.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100
          : 0;
      const growthPercentage = Math.round(revenueGrowth * 10) / 10;

      const finalData: SalesData = {
        ...processed,
        topItems,
        growthPercentage,
        lastUpdated: new Date().toISOString(),
        dataPeriod: `${previousData.dataPeriod} → ${processed.dataPeriod}`,
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (response.ok) {
        onSaved(finalData);

        try {
          await fetch('/api/discord/csv-stats-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statsData: { ...finalData, uploadType: 'growth' } }),
          });
        } catch (webhookError) {
          console.error('Growth calculation webhook error:', webhookError);
        }

        showStatus(
          'success',
          `Growth calculation complete! Revenue: ${growthPercentage > 0 ? '+' : ''}${growthPercentage}% | ${finalData.topItems.length} featured items loaded`
        );
      } else {
        showStatus('error', 'Failed to save processed data');
      }
    } catch (error) {
      console.error('Error processing growth calculation:', error);
      showStatus('error', 'Error processing files. Please check the CSV format.');
    } finally {
      setIsCalculating(false);
    }
  };

  const fileInputClasses =
    'block w-full text-sm text-ink-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-strong file:transition-colors';

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <ChartBarIcon className="h-5 w-5 text-brand-cyan-deep" />
        Growth Calculation
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Compare two months of sales CSVs to calculate the revenue growth percentage.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="previous-file" className="mb-1.5 block text-sm font-medium text-ink-secondary">
            Previous month
          </label>
          <input id="previous-file" ref={previousFileRef} type="file" accept=".csv" className={fileInputClasses} />
        </div>
        <div>
          <label htmlFor="current-file" className="mb-1.5 block text-sm font-medium text-ink-secondary">
            Current month
          </label>
          <input id="current-file" ref={currentFileRef} type="file" accept=".csv" className={fileInputClasses} />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGrowthCalculation}
        disabled={isCalculating}
        className="btn-primary mt-5 w-full text-sm disabled:opacity-50"
      >
        {isCalculating ? 'Calculating…' : 'Calculate Growth'}
      </button>
    </div>
  );
}
