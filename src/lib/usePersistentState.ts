import { useCallback, useState } from "react";

const PREFIX = "apify-prototype:";

/**
 * `useState` backed by localStorage — use it for UI state that a real backend would remember
 * (dismissed banners, collapsed sections, …). Clear localStorage to reset the demo.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const storageKey = PREFIX + key;
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (next: T) => {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setValue(next);
    },
    [storageKey],
  );

  return [value, set] as const;
}
