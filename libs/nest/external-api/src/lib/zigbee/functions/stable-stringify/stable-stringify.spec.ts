import { stableStringify } from './stable-stringify';

describe('stableStringify', () => {
  test('primitives and null', () => {
    expect(stableStringify(null)).toBe('null');
    expect(stableStringify(123)).toBe('123');
    expect(stableStringify('a"b')).toBe(JSON.stringify('a"b'));
    expect(stableStringify(true)).toBe('true');
  });

  test('stable key order', () => {
    const obj: object = { b: 2, a: 1 };
    expect(stableStringify(obj)).toBe('{"a":1,"b":2}');
  });

  test('undefined in object is omitted, in array becomes null', () => {
    expect(stableStringify({ a: undefined })).toBe('{}');
    expect(stableStringify([undefined, 1])).toBe('[null,1]');
  });

  test('toJSON is respected (Date)', () => {
    const d: Date = new Date('2020-01-01T00:00:00.000Z');
    expect(stableStringify(d)).toBe(JSON.stringify(d));
  });
});
