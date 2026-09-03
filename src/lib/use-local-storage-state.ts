"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

function subscribe(key: string, callback: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  return () => listeners.get(key)?.delete(callback);
}

/**
 * Estado sincronizado com localStorage via useSyncExternalStore — evita o padrão
 * "setState dentro de useEffect no mount" (hidratação) sem causar mismatch SSR/client.
 */
export function useLocalStorageState<T extends string>(key: string, defaultValue: T) {
  const getSnapshot = useCallback(() => window.localStorage.getItem(key) ?? defaultValue, [key, defaultValue]);
  const getServerSnapshot = useCallback(() => defaultValue, [defaultValue]);
  const sub = useCallback((callback: () => void) => subscribe(key, callback), [key]);

  const value = useSyncExternalStore(sub, getSnapshot, getServerSnapshot) as T;

  const setValue = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, next);
      emit(key);
    },
    [key]
  );

  return [value, setValue] as const;
}
