// YES BANK — Centralised API layer
// Change VITE_API_BASE in .env to point to a different backend host

import type { Account, Transaction, CreateAccountPayload } from '../types';

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080';

/**
 * Generic fetch wrapper with typed response and unified error handling.
 * Handles both JSON and plain-text responses from Spring Boot.
 */
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const contentType = res.headers.get('Content-Type') ?? '';
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as unknown as T;
}

export const bankApi = {
  /** Create a new bank account */
  createAccount: (data: CreateAccountPayload) =>
    request<Account>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Fetch all accounts */
  getAllAccounts: () => request<Account[]>('/accounts'),

  /** Fetch a single account by account number */
  getAccount: (acn: string) => request<Account>(`/accounts/${acn}`),

  /** Get current balance for an account */
  getBalance: (acn: string) => request<number>(`/accounts/${acn}/balance`),

  /** Deposit an amount; returns new balance */
  deposit: (acn: string, amount: number) =>
    request<number>(`/accounts/${acn}/deposit?amount=${amount}`, {
      method: 'POST',
    }),

  /** Withdraw an amount; returns new balance */
  withdraw: (acn: string, amount: number) =>
    request<number>(`/accounts/${acn}/withdraw?amount=${amount}`, {
      method: 'POST',
    }),

  /** Transfer from one account to another; returns success string */
  transfer: (acn: string, toAcn: string, amount: number) =>
    request<string>(`/accounts/${acn}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ accountNumber: toAcn, amount }),
    }),

  /** Delete an account; returns success string */
  deleteAccount: (acn: string) =>
    request<string>(`/accounts/${acn}/delete`, { method: 'DELETE' }),

  /** Get transaction history for an account */
  getHistory: (acn: string) =>
    request<Transaction[]>(`/accounts/${acn}/history`),
};
