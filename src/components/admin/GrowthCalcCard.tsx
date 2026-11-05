'use client';
import { useRef, useState } from 'react';
import { ChartBarIcon, DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
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
  const [fileNames, setFileNames] = useState<{ previous: string | null; current: string | null }>({
    previous: null,
    current: null,
  });

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

  const pickers = [
    { key: 'previous' as const, id: 'previous-file', label: 'Previous Month', ref: previousFileRef },
    { key: 'current' as const, id: 'current-file', label: 'Current Month', ref: currentFileRef },
  ];

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <ChartBarIcon className="h-5 w-5 text-brand-cyan-deep" />
        Growth Calculation
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Compare two months of sales CSVs to calculate the revenue growth percentage.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {pickers.map((picker) => {
          const fileName = fileNames[picker.key];
          return (
            <div key={picker.key}>
              <span className="mb-1.5 block text-sm font-medium text-ink-secondary">{picker.label}</span>
              {/* The real input stays focusable (sr-only) so keyboard users get the label's focus ring */}
              <label
                htmlFor={picker.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                  fileName
                    ? 'border-success/40 bg-success-soft text-success'
                    : 'border-line bg-surface-muted/60 text-ink-muted hover:border-accent-border hover:text-accent'
                }`}
              >
                {fileName ? (
                  <CheckCircleIcon className="h-5 w-5 shrink-0" />
                ) : (
                  <DocumentArrowUpIcon className="h-5 w-5 shrink-0" />
                )}
                <span className="min-w-0 truncate font-medium">{fileName ?? 'Choose CSV File'}</span>
                <input
                  id={picker.id}
                  ref={picker.ref}
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(event) => {
                    const name = event.target.files?.[0]?.name ?? null;
                    setFileNames((current) => ({ ...current, [picker.key]: name }));
                  }}
                />
              </label>
            </div>
          );
        })}
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
