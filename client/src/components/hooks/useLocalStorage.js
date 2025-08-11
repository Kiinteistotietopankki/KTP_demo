// hooks/useLocalStorage.js
import { useEffect, useState } from 'react';
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initialValue; }
    catch { return initialValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('Could not save to localStorage:', e); }
  }, [key, value]);
  return [value, setValue];
}