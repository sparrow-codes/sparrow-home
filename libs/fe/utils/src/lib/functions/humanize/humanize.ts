export function humanize(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str: string = String(value);

  if (str.trim() === '') {
    return '';
  }

  let result: string = str.replace(/[-_]+/g, ' ');
  result = result.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  result = result.replace(/\s+/g, ' ').trim();

  if (result.length === 0) {
    return '';
  }

  result = result.toLowerCase();
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
}
