/**
 * Consent helper for Google Consent Mode v2.
 *
 * Storage key: `rumahya_consent_v1` in localStorage.
 * Value: { analytics: boolean; ts: number; version: 1 }.
 *
 * Default state on first visit: ALL DENIED (set in layout.tsx via gtag).
 * Banner calls setConsent() which:
 *   1. Writes choice to localStorage
 *   2. Calls window.gtag('consent','update',...) so GA reacts immediately
 */

export const CONSENT_STORAGE_KEY = 'rumahya_consent_v1';
export const CONSENT_VERSION = 1;

export type ConsentState = {
  analytics: boolean;
  ts: number;
  version: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean): void {
  if (typeof window === 'undefined') return;

  const state: ConsentState = {
    analytics,
    ts: Date.now(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* localStorage may be blocked — gracefully degrade */
  }

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
}

export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
