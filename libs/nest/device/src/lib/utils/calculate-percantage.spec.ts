import { Logger } from '@nestjs/common';

import { calculatePercentage } from './calculate-percentage';

describe('calculatePercentage', () => {
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    loggerSpy = jest.spyOn(Logger, 'log').mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 0 when value equals from', () => {
    expect(calculatePercentage(10, 20, 10)).toBe(0);
    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('returns 100 when value equals to', () => {
    expect(calculatePercentage(10, 20, 20)).toBe(100);
    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('correctly rounds intermediate values', () => {
    expect(calculatePercentage(0, 6, 1)).toBe(17); // 16.666... -> 17
    expect(calculatePercentage(0, 3, 1)).toBe(33); // 33.333... -> 33
  });

  it('returns 0 and logs when value < from', () => {
    expect(calculatePercentage(10, 20, 5)).toBe(0);
    expect(loggerSpy).toHaveBeenCalledWith('Invalid values');
  });

  it('returns 0 and logs when value > to', () => {
    expect(calculatePercentage(10, 20, 25)).toBe(0);
    expect(loggerSpy).toHaveBeenCalledWith('Invalid values');
  });

  it('returns 0 and logs when from === to', () => {
    expect(calculatePercentage(10, 10, 10)).toBe(0);
    expect(loggerSpy).toHaveBeenCalledWith('Invalid values');
  });
});
