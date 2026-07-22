import { fetchWithRetry } from '@/lib/server/httpClient';

export const DISCORD_LIMITS = {
  content: 2000,
  embedTitle: 256,
  embedDescription: 4096,
  fieldName: 256,
  fieldValue: 1024,
};

export const formatNumber = (value: number) => new Intl.NumberFormat('en-GB').format(value);

export const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

export const escapeDiscordMarkdown = (input: string) =>
  input.replace(/[\\`*_{}[\]()#+\-.!|>~]/g, '\\$&');

export const toSafeField = (name: string, value: string, inline = false) => ({
  name: truncate(name, DISCORD_LIMITS.fieldName),
  value: truncate(value || '-', DISCORD_LIMITS.fieldValue),
  inline,
});

export const buildProgressBar = (completed: number, total: number, length = 10) => {
  if (total <= 0) return '░'.repeat(length);
  const ratio = Math.max(0, Math.min(1, completed / total));
  const filled = Math.round(ratio * length);
  return `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, length - filled))}`;
};

// Thrown when a required webhook env var is missing; routes map it to a 500
// with the original error message so response contracts stay identical.
export class WebhookConfigError extends Error {}

export const postDiscordWebhook = async (webhookUrl: string, payload: unknown) => {
  const response = await fetchWithRetry(
    webhookUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    { timeoutMs: 10000, retries: 2, retryDelayMs: 500 }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Discord webhook failed (${response.status}): ${errorText}`);
  }
};
