interface FetchWithRetryOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  retryOnStatuses?: number[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchWithRetryOptions = {}
) => {
  const {
    timeoutMs = 10000,
    retries = 1,
    retryDelayMs = 500,
    retryOnStatuses = [408, 429, 500, 502, 503, 504],
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const safeInit = init ? { ...init } : {};
      delete safeInit.signal;
      const response = await fetch(input, {
        ...safeInit,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!retryOnStatuses.includes(response.status) || attempt === retries) {
        return response;
      }

      lastError = new Error(`Request failed with status ${response.status}`);
    } catch (error) {
      clearTimeout(timeout);
      lastError = error instanceof Error ? error : new Error('Request failed');
    }

    if (attempt < retries) {
      await sleep(retryDelayMs * (attempt + 1));
    }
  }

  throw lastError || new Error('Request failed');
};
