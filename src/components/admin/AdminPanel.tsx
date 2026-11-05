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
    <div className="relative min-h-dvh overflow-x-hidden bg-canvas">
      <AdminNavigation onLogout={handleLogout} />

      {/* Soft brand light behind the page header */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-96">
        <div className="bg-grid absolute inset-0 opacity-80" />
        <div
          className="absolute top-[-6rem] left-[-6rem] h-[26rem] w-[26rem]"
          style={{ background: 'radial-gradient(closest-side, rgb(147 51 234 / 0.12), transparent 70%)' }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 pt-10 pb-[max(4rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-12 lg:px-8">
        <header className="animate-rise">
          <p className="text-sm font-medium text-ink-muted">Welcome back, Corey</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Update UGC stats and milestones. Saves refresh the live homepage within seconds.
          </p>
        </header>

        {statusMessage && (
          <div
            role="status"
            className={`animate-rise fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-xl border p-4 shadow-float sm:right-6 sm:left-auto sm:max-w-sm ${
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
          <h2 className="section-label mb-4">Data Updates</h2>
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
