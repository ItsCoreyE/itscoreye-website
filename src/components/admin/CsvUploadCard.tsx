'use client';
import { useRef, useState } from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';
import { processSalesCsv } from '@/lib/csv';
import { attachThumbnails } from '@/lib/thumbnails';
import type { SalesData } from '@/types/ugc';

interface CsvUploadCardProps {
  onSaved: (data: SalesData) => void;
  showStatus: (type: 'success' | 'error', text: string) => void;
}

export default function CsvUploadCard({ onSaved, showStatus }: CsvUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const processed = processSalesCsv(text);
      const processedData: SalesData = {
        ...processed,
        topItems: await attachThumbnails(processed.topItems),
      };

      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      if (response.ok) {
        onSaved(processedData);

        try {
          await fetch('/api/discord/csv-stats-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statsData: { ...processedData, uploadType: 'single' } }),
          });
        } catch (webhookError) {
          console.error('CSV stats webhook error:', webhookError);
        }

        showStatus(
          'success',
          `CSV processed! ${processedData.topItems.length} featured items loaded. Data is now live!`
        );
      } else {
        showStatus('error', 'Failed to save processed data');
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      showStatus('error', 'Error processing file. Please check the CSV format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card flex flex-1 flex-col p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <FolderIcon className="h-5 w-5 text-brand-blue" />
        CSV Upload
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        Upload a single month&apos;s Roblox sales CSV. Totals, best sellers, and thumbnails are
        processed automatically and a Discord update is posted.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="btn-secondary mt-auto w-full text-sm disabled:opacity-50"
      >
        {isUploading ? 'Processing…' : 'Choose CSV file'}
      </button>
    </div>
  );
}
