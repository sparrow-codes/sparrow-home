import { calculatePercentage } from '../../utils/calculate-percentage';

export function toSignalStrength(linkQuality: number | null): number {
  return linkQuality ? calculatePercentage(0, 255, linkQuality) : 0;
}
