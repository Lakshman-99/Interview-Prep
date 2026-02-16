import { useState, useEffect, useCallback } from "react";

const PREFIX = "dsa-rev::";

export function useLocalStorage(key, initialValue) {
  const storageKey = PREFIX + key;

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch { /* quota exceeded — fail silently */ }
  }, [storageKey, value]);

  return [value, setValue];
}

// Convenience: toggle a boolean keyed by id inside an object
// e.g. { "two-sum": true, "3sum": false }
export function usePersistedSet(key) {
  const [map, setMap] = useLocalStorage(key, {});

  const toggle = useCallback((id) => {
    setMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, [setMap]);

  const isOn = useCallback((id) => !!map[id], [map]);
  const count = Object.values(map).filter(Boolean).length;

  return { map, setMap, toggle, isOn, count };
}