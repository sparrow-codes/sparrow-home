import { Logger } from '@nestjs/common';

export function calculatePercentage(from: number, to: number, value: number): number {
  if (value < from || value > to || from === to) {
    Logger.log('Invalid values');
    return 0;
  }

  return Math.round(((value - from) / (to - from)) * 100);
}
