'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  BanknotesIcon,
  ShoppingBagIcon,
  PaintBrushIcon,
  SparklesIcon,
  TrophyIcon,
  DocumentCheckIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import type { Milestone, MilestonesData } from '@/types/ugc';

type TabCategory = 'verification' | 'revenue' | 'sales' | 'items' | 'collectibles';

const tabs: Array<{ key: TabCategory; title: string; Icon: typeof TrophyIcon }> = [
  { key: 'verification', title: 'Main Goal', Icon: CheckBadgeIcon },
  { key: 'revenue', title: 'Revenue', Icon: BanknotesIcon },
  { key: 'sales', title: 'Sales', Icon: ShoppingBagIcon },
  { key: 'items', title: 'Items', Icon: PaintBrushIcon },
  { key: 'collectibles', title: 'Collectibles', Icon: SparklesIcon },
];

function ToggleSwitch({
  checked,
  onChange,
  label,
  size = 'md',
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  size?: 'md' | 'lg';
}) {
  // Track, knob, inset, and travel must stay in sync: the knob is centred
  // when inset * 2 + knob height equals track height, and travel equals
  // track width minus inset * 2 minus knob width.
  const track = size === 'lg' ? 'h-9 w-16' : 'h-6 w-12';
  const knob = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  const inset = size === 'lg' ? 'top-1 left-1' : 'top-0.5 left-0.5';
  const travel = size === 'lg' ? 'translate-x-7' : 'translate-x-6';

  return (
    <label className="-m-2 flex flex-shrink-0 cursor-pointer items-center p-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="sr-only"
      />
      <span
        className={`relative block rounded-full transition-colors duration-300 ${track} ${
          checked ? 'bg-success' : 'bg-line'
        }`}
      >
        <span
          className={`absolute rounded-full bg-white shadow-sm transition-transform duration-300 ${inset} ${knob} ${
            checked ? travel : ''
          }`}
        />
      </span>
    </label>
  );
}

export default function MilestoneAdmin() {
  const [milestonesData, setMilestonesData] = useState<MilestonesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabCategory>('verification');

  const fetchMilestones = useCallback(async () => {
    try {
      const response = await fetch('/api/milestones');
      if (response.ok) {
        const data = await response.json();
        setMilestonesData(data);
        setError(null);
      } else {
        setError('Failed to load milestones');
      }
    } catch (fetchError) {
      console.error('Error fetching milestones:', fetchError);
      setError('Failed to load milestones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMilestones();
  }, [fetchMilestones]);

  const handleMilestoneToggle = (milestoneId: string) => {
    if (!milestonesData) return;
    setMilestonesData({
      ...milestonesData,
      milestones: milestonesData.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, isCompleted: !milestone.isCompleted }
          : milestone
      ),
    });
  };

  const saveMilestones = async () => {
    if (!milestonesData) return;

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestones: milestonesData.milestones }),
      });

      if (response.ok) {
        setSuccessMessage('Milestones saved successfully!');
        await fetchMilestones();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to save milestones');
      }
    } catch (saveError) {
      console.error('Error saving milestones:', saveError);
      setError('Failed to save milestones');
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryData = (category: TabCategory): Milestone[] => {
    if (!milestonesData) return [];
    return milestonesData.milestones
      .filter((m) => m.category === category)
      .sort((a, b) => a.target - b.target);
  };

  if (isLoading) {
    return (
      <div className="card animate-pulse space-y-6 p-6 sm:p-8">
        <div className="h-10 w-1/3 rounded-lg bg-surface-muted" />
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-surface-muted" />
          ))}
        </div>
        <div className="h-72 rounded-lg bg-surface-muted" />
      </div>
    );
  }

  const completed = milestonesData?.milestones.filter((m) => m.isCompleted).length ?? 0;
  const total = milestonesData?.milestones.length ?? 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const verificationMilestone = milestonesData?.milestones.find(
    (m) => m.category === 'verification'
  );

  return (
    <div className="card p-5 sm:p-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-ink">
            <TrophyIcon className="h-6 w-6 text-accent" />
            Milestone Manager
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {completed} of {total} completed ({percentage}%)
          </p>
        </div>

        <button
          onClick={saveMilestones}
          disabled={isSaving}
          className="btn-primary w-full text-sm disabled:opacity-50 sm:w-auto"
        >
          <DocumentCheckIcon className="h-5 w-5" />
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mt-4 rounded-lg border border-danger/20 bg-danger-soft p-3">
          <p className="text-sm break-words text-danger">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 rounded-lg border border-success/20 bg-success-soft p-3">
          <p className="text-sm break-words text-success">{successMessage}</p>
        </div>
      )}

      {/* Tabs: scrollable pill row on small screens, 5-column grid from sm up */}
      <div className="mt-6 flex gap-2 overflow-x-auto rounded-xl bg-surface-muted p-2 sm:grid sm:grid-cols-5">
        {tabs.map((tab) => {
          const categoryData = getCategoryData(tab.key);
          const categoryCompleted = categoryData.filter((m) => m.isCompleted).length;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`min-w-[5.25rem] shrink-0 rounded-lg px-3 py-3 text-sm font-medium transition-colors sm:min-w-0 ${
                isActive
                  ? 'bg-surface text-accent shadow-card'
                  : 'text-ink-muted hover:bg-surface/60 hover:text-ink'
              }`}
            >
              <span className="flex flex-col items-center gap-1">
                <tab.Icon className="h-5 w-5" />
                <span className="leading-tight">{tab.title}</span>
                {tab.key !== 'verification' && (
                  <span className="text-xs text-ink-muted">
                    {categoryCompleted}/{categoryData.length}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'verification' ? (
          <div className="space-y-4">
            {verificationMilestone && (
              <div
                className={`rounded-xl border-2 p-5 sm:p-7 ${
                  verificationMilestone.isCompleted
                    ? 'border-success/40 bg-success-soft'
                    : 'border-accent-border bg-accent-soft/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <CheckBadgeIcon
                      className={`h-9 w-9 flex-shrink-0 sm:h-12 sm:w-12 ${
                        verificationMilestone.isCompleted ? 'text-success' : 'text-accent'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold tracking-wide text-accent uppercase">
                        Main Goal
                      </div>
                      <div className="mt-1 text-lg font-semibold break-words text-ink sm:text-xl">
                        {verificationMilestone.description}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-ink-secondary">
                        <div className="flex items-start gap-2">
                          <BanknotesIcon className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>2,000,000 Robux revenue (90 days)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <ShoppingBagIcon className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>200,000 items sold</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ToggleSwitch
                    size="lg"
                    checked={verificationMilestone.isCompleted}
                    onChange={() => handleMilestoneToggle(verificationMilestone.id)}
                    label={verificationMilestone.description}
                  />
                </div>
              </div>
            )}

            <div className="rounded-lg border border-accent-border bg-accent-soft/50 p-4">
              <p className="text-center text-sm break-words text-ink-secondary">
                <strong>Note:</strong> When you toggle this milestone and save, an @everyone
                notification will be sent to Discord #milestones channel!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {getCategoryData(activeTab).map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors sm:items-center sm:gap-4 sm:p-4 ${
                  milestone.isCompleted
                    ? 'border-success/20 bg-success-soft'
                    : 'border-line bg-surface hover:border-accent-border'
                }`}
              >
                <ToggleSwitch
                  checked={milestone.isCompleted}
                  onChange={() => handleMilestoneToggle(milestone.id)}
                  label={milestone.description}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium break-words sm:text-base ${
                      milestone.isCompleted ? 'text-success' : 'text-ink-secondary'
                    }`}
                  >
                    {milestone.description}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    Target: {milestone.target.toLocaleString()}
                  </p>
                </div>

                <span
                  className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:block ${
                    milestone.isCompleted
                      ? 'bg-success/10 text-success'
                      : 'bg-surface-muted text-ink-muted'
                  }`}
                >
                  {milestone.isCompleted ? '✓' : '○'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {milestonesData && (
        <div className="mt-6 flex flex-col items-start gap-2 border-t border-line pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="break-words">
              Last updated: {new Date(milestonesData.lastUpdated).toLocaleString()}
            </span>
          </div>
          <span className="hidden sm:inline">Press Save to update live website</span>
        </div>
      )}
    </div>
  );
}
