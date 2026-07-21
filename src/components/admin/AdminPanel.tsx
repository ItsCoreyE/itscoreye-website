'use client';
import { useState, useEffect } from 'react';
import type { SalesData } from '@/types/ugc';
import { normalizeSalesData } from '@/lib/salesData';
import AdminNavigation from './AdminNavigation';
import LoginForm from './LoginForm';
import StatsSummary from './StatsSummary';
import ManualStatsForm from './ManualStatsForm';
import CsvUploadCard from './CsvUploadCard';
import GrowthCalcCard from './GrowthCalcCard';
import MilestoneAdmin from './MilestoneAdmin';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Load current persisted stats on mount.
  useEffect(() => {
    let active = true;

    const loadSalesData = async () => {
      try {
        const response = await fetch('/api/data', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        const normalized = normalizeSalesData(data);
        if (active && normalized) {
          setSalesData(normalized);
        }
      } catch (error) {
        console.error('Failed to load initial sales data:', error);
      }
    };

    void loadSalesData();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    void fetch('/api/admin/logout', { method: 'POST' }).catch((error) => {
      console.error('Logout cleanup error:', error);
    });
    setIsAuthenticated(false);
    setSalesData(null);
    setStatusMessage(null);
  };

  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AdminNavigation onLogout={handleLogout} />

      <div className="mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage your UGC business</p>
        </header>

        {statusMessage && (
          <div
            role="status"
            className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border p-4 shadow-card-hover ${
              statusMessage.type === 'success'
                ? 'border-success/20 bg-success-soft'
                : 'border-danger/20 bg-danger-soft'
            }`}
          >
            <p
              className={`text-sm break-words ${
                statusMessage.type === 'success' ? 'text-success' : 'text-danger'
              }`}
            >
              {statusMessage.text}
            </p>
          </div>
        )}

        <section className="mt-8">
          <h2 className="section-label mb-4">Overview</h2>
          <StatsSummary salesData={salesData} />
        </section>

        <section className="mt-10">
          <h2 className="section-label mb-4">Data updates</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ManualStatsForm
              currentData={salesData}
              onSaved={setSalesData}
              showStatus={showStatus}
            />
            <div className="flex flex-col gap-6">
              <CsvUploadCard onSaved={setSalesData} showStatus={showStatus} />
              <GrowthCalcCard onSaved={setSalesData} showStatus={showStatus} />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-label mb-4">Milestones</h2>
          <MilestoneAdmin />
        </section>
      </div>
    </div>
  );
}
