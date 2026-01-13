export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value !== undefined ? value : null);
  }

  if (value instanceof Date) {
    return `"${value.toISOString()}"`;
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const obj: Record<string, unknown> = value as Record<string, unknown>;
  const keys: string[] = Object.keys(obj)
    .sort()
    .filter((key) => key && obj[key] !== undefined);

  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}
