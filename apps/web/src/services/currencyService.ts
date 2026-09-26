/**
 * Real-Time Currency Conversion & Exchange Rate Service
 * Fetches and caches live USD to INR exchange rates from reliable open APIs with zero-flicker localStorage caching.
 */

const CACHE_KEY = 'nagrik_usd_inr_rate';
const CACHE_TIME_KEY = 'nagrik_usd_inr_timestamp';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL

// Fallback rate based on recent real-world USD/INR institutional rate (~95.90)
export const DEFAULT_USD_TO_INR_RATE = 95.90;

/**
 * Returns the synchronous cached rate from localStorage or default fallback
 */
export function getCachedUsdToInrRate(): number {
  if (typeof window === 'undefined') return DEFAULT_USD_TO_INR_RATE;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = parseFloat(cached);
      if (!isNaN(parsed) && parsed > 50 && parsed < 200) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_USD_TO_INR_RATE;
}

/**
 * Fetches the live USD to INR exchange rate with multi-source fallback
 */
export async function fetchLiveUsdToInrRate(): Promise<number> {
  if (typeof window !== 'undefined') {
    try {
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
      const cachedRate = localStorage.getItem(CACHE_KEY);
      if (cachedTime && cachedRate) {
        const age = Date.now() - parseInt(cachedTime, 10);
        if (age < CACHE_TTL_MS) {
          const rate = parseFloat(cachedRate);
          if (!isNaN(rate) && rate > 50 && rate < 200) {
            return rate;
          }
        }
      }
    } catch {}
  }

  // Multi-tier API endpoints for 100% uptime
  const endpoints = [
    async () => {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('open.er-api failed');
      const data = await res.json();
      return data?.rates?.INR ? Number(data.rates.INR) : null;
    },
    async () => {
      const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!res.ok) throw new Error('exchangerate-api failed');
      const data = await res.json();
      return data?.rates?.INR ? Number(data.rates.INR) : null;
    },
    async () => {
      const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      if (!res.ok) throw new Error('currency-api failed');
      const data = await res.json();
      return data?.usd?.inr ? Number(data.usd.inr) : null;
    }
  ];

  for (const fetcher of endpoints) {
    try {
      const inrRate = await fetcher();
      if (inrRate && inrRate > 50 && inrRate < 200) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(CACHE_KEY, inrRate.toString());
            localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
          } catch {}
        }
        return inrRate;
      }
    } catch (err) {
      console.warn('Exchange rate API fallback notice:', err);
    }
  }

  return getCachedUsdToInrRate();
}

/**
 * Converts USD to INR using either provided rate or cached rate
 */
export function convertUsdToInr(usdAmount: number, rate?: number): number {
  const activeRate = rate || getCachedUsdToInrRate();
  return usdAmount * activeRate;
}

/**
 * Formats amount into Indian Rupee string (₹) with standard Indian numbering
 */
export function formatINR(amount: number, options?: { showDecimals?: boolean }): string {
  const showDecimals = options?.showDecimals ?? false;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);
}

/**
 * Formats amount into USD string ($)
 */
export function formatUSD(amount: number, options?: { showDecimals?: boolean }): string {
  const showDecimals = options?.showDecimals ?? true;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);
}
