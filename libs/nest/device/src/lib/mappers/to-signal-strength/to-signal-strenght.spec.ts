import { calculatePercentage } from '../../utils/calculate-percentage';
import { toSignalStrength } from './to-signal-strength';

describe('toSignalStrength', () => {
  it('returns 0 when nullish or 0', () => {
    expect(toSignalStrength(null)).toBe(0);
    expect(toSignalStrength(undefined as never)).toBe(0);
    expect(toSignalStrength(NaN)).toBe(0);
    expect(toSignalStrength(0)).toBe(0);
  });

  it('delegates to calculatePercentage when > 0', () => {
    const linkQuality: number = toSignalStrength(128);
    expect(linkQuality).toBe(calculatePercentage(0, 255, 128));
  });

  it('should return 0', () => {
    const linkQuality: number = toSignalStrength(0);
    expect(linkQuality).toBe(0);
  });

  it('should return 100', () => {
    const linkQuality: number = toSignalStrength(255);
    expect(linkQuality).toBe(100);
  });
});
