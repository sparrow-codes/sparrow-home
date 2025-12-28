import { Subject } from 'rxjs';

import { minVisibleMs } from './min-visible';

jest.useFakeTimers();

describe('minVisibleMs', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('throws when time is negative', () => {
    expect(() => minVisibleMs(-1)).toThrow(/Time must be greater than or equal to 0/);
  });

  it('for time 0 behaves like distinctUntilChanged (immediate propagation)', () => {
    const s: Subject<boolean> = new Subject<boolean>();
    const out: boolean[] = [];
    s.pipe(minVisibleMs(0)).subscribe((v: boolean) => out.push(v));

    s.next(true);
    expect(out).toEqual([true]);

    s.next(false);
    expect(out).toEqual([true, false]);
  });

  it('delays false until min visible time has passed', () => {
    const s: Subject<boolean> = new Subject<boolean>();
    const out: boolean[] = [];
    s.pipe(minVisibleMs(500)).subscribe((v: boolean) => out.push(v));

    s.next(true); // t=0 -> emit true immediately
    jest.advanceTimersByTime(0);
    expect(out).toEqual([true]);

    s.next(false); // t=0 -> should wait remaining 500ms
    jest.advanceTimersByTime(499);
    expect(out).toEqual([true]);

    jest.advanceTimersByTime(1);
    expect(out).toEqual([true, false]);
  });

  it('emits false immediately if visible longer than required', () => {
    const s: Subject<boolean> = new Subject<boolean>();
    const out: boolean[] = [];
    s.pipe(minVisibleMs(200)).subscribe((v: boolean) => out.push(v));

    s.next(true); // t=0
    jest.advanceTimersByTime(300); // visible for 300ms
    s.next(false); // t=300 -> visibleFor = 300 > 200 -> false immediately

    expect(out).toEqual([true, false]);
  });
});
