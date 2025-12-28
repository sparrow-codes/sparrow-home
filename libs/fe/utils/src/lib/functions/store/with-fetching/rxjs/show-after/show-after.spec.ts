import { Subject } from 'rxjs';

import { showAfterMs } from './show-after-ms';

jest.useFakeTimers();

describe('showAfterMs', () => {
  it('emits true after timeout', () => {
    const subject: Subject<boolean> = new Subject<boolean>();
    const results: boolean[] = [];
    subject.pipe(showAfterMs(500)).subscribe((v) => results.push(v));
    subject.next(true);
    jest.advanceTimersByTime(499);
    expect(results).toEqual([]); // nothing yet
    jest.advanceTimersByTime(1);
    expect(results).toEqual([true]);
  });

  it('throws when time is negative', () => {
    expect(() => showAfterMs(-1)).toThrow(/Time must be greater than or equal to 0/);
  });

  it('emits true immediately when time is 0', () => {
    const subject: Subject<boolean> = new Subject<boolean>();
    const results: boolean[] = [];
    subject.pipe(showAfterMs(0)).subscribe((v) => results.push(v));
    subject.next(true);
    expect(results).toEqual([true]);
  });
});
