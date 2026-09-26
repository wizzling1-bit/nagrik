'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCachedUsdToInrRate,
  fetchLiveUsdToInrRate,
  convertUsdToInr,
  formatINR,
  formatUSD,
  DEFAULT_USD_TO_INR_RATE
} from '../services/currencyService';

interface CurrencyContextType {
  rate: number;
  isLoading: boolean;
  lastUpdated: Date | null;
  usdToInr: (usd: number) => number;
  formatInr: (amount: number, showDecimals?: boolean) => string;
  formatUsd: (amount: number, showDecimals?: boolean) => string;
  cpmRateText: (usdCpm?: number) => string;
  refreshRate: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rate, setRate] = useState<number>(DEFAULT_USD_TO_INR_RATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadRate = async () => {
    setIsLoading(true);
    try {
      const liveRate = await fetchLiveUsdToInrRate();
      setRate(liveRate);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('[CurrencyContext] Error fetching live rate:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have a valid cached rate in localStorage on client mount
    const cached = getCachedUsdToInrRate();
    if (cached && cached !== DEFAULT_USD_TO_INR_RATE) {
      setRate(cached);
    }
    loadRate();
  }, []);

  const usdToInr = (usd: number) => convertUsdToInr(usd, rate);
  const formatInrWrapper = (amount: number, showDecimals = false) => formatINR(amount, { showDecimals });
  const formatUsdWrapper = (amount: number, showDecimals = true) => formatUSD(amount, { showDecimals });
  const cpmRateText = (usdCpm = 1.0) => `$${usdCpm.toFixed(2)} CPM (~₹${(usdCpm * rate).toFixed(2)} / 1k reads)`;

  return (
    <CurrencyContext.Provider
      value={{
        rate,
        isLoading,
        lastUpdated,
        usdToInr,
        formatInr: formatInrWrapper,
        formatUsd: formatUsdWrapper,
        cpmRateText,
        refreshRate: loadRate
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Graceful fallback if called outside provider
    const fallbackRate = DEFAULT_USD_TO_INR_RATE;
    return {
      rate: fallbackRate,
      isLoading: false,
      lastUpdated: null,
      usdToInr: (usd: number) => usd * fallbackRate,
      formatInr: (amt: number, showDecimals = false) => formatINR(amt, { showDecimals }),
      formatUsd: (amt: number, showDecimals = true) => formatUSD(amt, { showDecimals }),
      cpmRateText: (usdCpm = 1.0) => `$${usdCpm.toFixed(2)} CPM (~₹${(usdCpm * fallbackRate).toFixed(2)} / 1k reads)`,
      refreshRate: async () => {}
    };
  }
  return context;
};
