'use client';

import { create } from 'zustand';
import { useEffect } from 'react';

export interface SiteSettings {
  id: string;
  siteName: string;
  siteNameBn: string;
  phone: string;
  email: string;
  address: string;
  addressBn?: string;
  deliveryCharge: number;
  freeDeliveryMin: number;
  minOrderAmount?: number;
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashSandbox: boolean;
  bkashAppKey?: string;
  bkashAppSecret?: string;
  nagadEnabled: boolean;
  nagadSandbox: boolean;
  nagadMerchantId?: string;
}

const defaultSettings: SiteSettings = {
  id: 'default',
  siteName: 'Rafsan Agro',
  siteNameBn: 'রফসান এগ্রো',
  phone: '01712345678',
  email: 'info@rafsanagro.com',
  address: 'Bazaar Road, Rangpur Sadar, Rangpur',
  deliveryCharge: 80,
  freeDeliveryMin: 3000,
  codEnabled: true,
  bkashEnabled: true,
  bkashSandbox: true,
  nagadEnabled: true,
  nagadSandbox: true,
};

interface SettingsStore {
  settings: SiteSettings;
  isLoading: boolean;
  isFetched: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  isFetched: false,

  fetchSettings: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json.success && json.data) {
        set({ settings: { ...defaultSettings, ...json.data }, isFetched: true });
      }
    } catch (err) {
      console.warn('Failed to fetch site settings from database API:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: (newSettings) => {
    set({ settings: { ...get().settings, ...newSettings } });
  },
}));

/**
 * Custom React Hook to fetch and consume real-time site settings & contact details
 */
export function useSiteSettings() {
  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const isFetched = useSettingsStore((s) => s.isFetched);

  useEffect(() => {
    if (!isFetched) {
      fetchSettings();
    }
  }, [isFetched, fetchSettings]);

  return { settings, isFetched, fetchSettings };
}
