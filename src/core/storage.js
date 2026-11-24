const PREFIX = 'web3fiber:';

export function localStorageAdapter() {
  return {
    async load(zoneId) {
      if (typeof window === 'undefined') return null;
      try {
        const raw = window.localStorage.getItem(PREFIX + zoneId);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        console.warn('[Web3Fiber] Could not load layout:', error);
        return null;
      }
    },
    async save(zoneId, layout) {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(PREFIX + zoneId, JSON.stringify(layout));
      } catch (error) {
        // Storage can be unavailable (private browsing, quota, blocked cookies).
        // Persistence failure must never take down the host website.
        console.warn('[Web3Fiber] Could not save layout:', error);
      }
    },
  };
}

export function memoryStorageAdapter() {
  const layouts = new Map();
  return {
    async load(zoneId) { return layouts.get(zoneId) ?? null; },
    async save(zoneId, layout) { layouts.set(zoneId, layout); },
  };
}
