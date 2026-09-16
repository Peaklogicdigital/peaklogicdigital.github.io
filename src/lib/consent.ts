export type ConsentChoice = "all" | "essential";

const STORAGE_KEY = "peaklogic-cookie-consent";

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "all" || value === "essential" ? value : null;
}

export function storeConsent(choice: ConsentChoice) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, choice);
}

/**
 * Gate for any non-essential third-party script (analytics, ads, etc).
 * Nothing on this site loads one today, but any future script must check
 * this before loading or executing rather than firing unconditionally.
 */
export function hasAnalyticsConsent(): boolean {
  return getStoredConsent() === "all";
}
