export function has(access: number = 0, bit: 1 | 2 | 4): boolean {
  return (access & bit) === bit;
}
