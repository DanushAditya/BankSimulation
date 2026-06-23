// YES BANK — Auth + Theme Zustand stores
// Persisted to localStorage so page refreshes maintain session

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Account } from '../types';

/* ─────────────────────────── Auth Store ─────────────────────────── */

interface AuthState {
  role: 'admin' | 'customer' | null;
  account: Account | null;
  setAdmin: () => void;
  setCustomer: (account: Account) => void;
  updateAccount: (account: Account) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      account: null,
      setAdmin: () => set({ role: 'admin', account: null }),
      setCustomer: (account) => set({ role: 'customer', account }),
      updateAccount: (account) => set({ account }),
      logout: () => set({ role: null, account: null }),
    }),
    { name: 'yb-auth' }
  )
);

/* ─────────────────────────── Theme Store ─────────────────────────── */

interface ThemeState {
  darkMode: boolean;
  toggleDark: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDark: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'yb-theme' }
  )
);
