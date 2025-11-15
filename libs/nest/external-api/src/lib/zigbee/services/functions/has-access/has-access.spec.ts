import { has } from './has-access';

/**
 * Bit meanings:
 * 1 = read, 2 = write, 4 = get
 */

describe('has-access', () => {
  it('returns false for default access=0', () => {
    expect(has(undefined, undefined as never)).toBe(false);
    expect(has(0, 1)).toBe(false);
    expect(has(0, 2)).toBe(false);
    expect(has(0, 4)).toBe(false);
  });

  it('returns true when the exact bit is present', () => {
    expect(has(1, 1)).toBe(true); // 001 & 001 = 001
    expect(has(2, 2)).toBe(true); // 010 & 010 = 010
    expect(has(4, 4)).toBe(true); // 100 & 100 = 100
  });

  it('returns false when the exact bit is NOT present', () => {
    expect(has(1, 2)).toBe(false);
    expect(has(1, 4)).toBe(false);
    expect(has(2, 1)).toBe(false);
    expect(has(2, 4)).toBe(false);
    expect(has(4, 1)).toBe(false);
    expect(has(4, 2)).toBe(false);
  });

  it('works for combinations of bits', () => {
    expect(has(3, 1)).toBe(true);
    expect(has(3, 2)).toBe(true);
    expect(has(3, 4)).toBe(false);

    expect(has(5, 1)).toBe(true);
    expect(has(5, 2)).toBe(false);
    expect(has(5, 4)).toBe(true);

    expect(has(6, 1)).toBe(false);
    expect(has(6, 2)).toBe(true);
    expect(has(6, 4)).toBe(true);

    expect(has(7, 1)).toBe(true);
    expect(has(7, 2)).toBe(true);
    expect(has(7, 4)).toBe(true);
  });

  it('is robust to larger access values (extra bits ignored)', () => {
    expect(has(9, 1)).toBe(true);
    expect(has(9, 2)).toBe(false);
    expect(has(9, 4)).toBe(false);
  });

  it('handles edge numeric inputs gracefully', () => {
    expect(has(undefined, 1)).toBe(false);
    expect(has(null as never, 1)).toBe(false);
    expect(has(NaN, 1)).toBe(false);
  });
});
