// YES BANK — Utility functions for formatting

import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a number as Indian Rupee currency string
 * e.g. 124500 → "₹1,24,500.00"
 */
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);

/**
 * Mask account number — show only last 4 digits
 * e.g. "0000000000001234" → "•••• •••• •••• 1234"
 */
export const maskAccount = (acn: string): string => {
  if (!acn || acn.length < 4) return acn;
  return `•••• •••• •••• ${acn.slice(-4)}`;
};

/**
 * Format ISO timestamp string to readable date + time
 * e.g. "2025-06-21T10:30:00" → "21 Jun 2025, 10:30 AM"
 */
export const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/**
 * Format ISO timestamp as relative time from now
 * e.g. "2025-06-21T10:30:00" → "2 hours ago"
 */
export const formatRelative = (iso: string): string => {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
};

/**
 * Format ISO timestamp to "MMM yyyy" for monthly grouping
 * e.g. "2025-06-21T10:30:00" → "Jun 2025"
 */
export const formatMonth = (iso: string): string => {
  try {
    return format(new Date(iso), 'MMM yyyy');
  } catch {
    return iso;
  }
};

/**
 * Format ISO timestamp to short date for chart labels
 * e.g. "2025-06-21T10:30:00" → "21 Jun"
 */
export const formatShortDate = (iso: string): string => {
  try {
    return format(new Date(iso), 'dd MMM');
  } catch {
    return iso;
  }
};

/**
 * Get initials from a full name (max 2 chars)
 * e.g. "Priya Sharma" → "PS"
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Animated counter hook — count from 0 to target over duration ms
 */
import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    setValue(0);

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
