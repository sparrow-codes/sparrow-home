export function capitalizeFirstLetter(value: string): string {
  value = value.trim();

  return value.charAt(0).toUpperCase() + value.slice(1);
}
