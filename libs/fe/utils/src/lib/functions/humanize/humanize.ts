export function humanize(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str: string = String(value);

  if (str.trim() === '') {
    return '';
  }

  let result: string = str
    .replace(/[-_]+/g, ' ') // a-b_c → a b c
    .replace(/([0-9])([a-zA-Z])/g, '$1 $2') // 1value → 1 value
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase → camel Case
    .replace(/\s+/g, ' ')
    .trim();

  if (result.length === 0) {
    return '';
  }

  result = result.toLowerCase();
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
}
