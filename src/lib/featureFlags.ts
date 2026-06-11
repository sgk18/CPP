// Lightweight feature flag helper.
// Flags are read from `process.env.NEXT_PUBLIC_FEATURE_FLAGS` as a JSON string.
// Example: NEXT_PUBLIC_FEATURE_FLAGS='{"mockAuth":true}'

export function getFlags(): Record<string, any> {
  try {
    const raw = process?.env?.NEXT_PUBLIC_FEATURE_FLAGS || (typeof window !== 'undefined' && (window as any).__FEATURE_FLAGS__);
    if (!raw) return {};
    if (typeof raw === 'string') return JSON.parse(raw);
    return raw as Record<string, any>;
  } catch (e) {
    console.warn('Invalid feature flags:', e);
    return {};
  }
}

export function isFeatureEnabled(name: string): boolean {
  const flags = getFlags();
  return Boolean(flags && flags[name]);
}
