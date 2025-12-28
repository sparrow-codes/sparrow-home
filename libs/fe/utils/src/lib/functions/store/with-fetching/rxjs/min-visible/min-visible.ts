import { Observable, of, timer, Timestamp } from 'rxjs';
import { distinctUntilChanged, map, pairwise, startWith, switchMap, timestamp } from 'rxjs/operators';

/**
 * Ensure that when the source transitions from true -> false, the false value
 * is emitted only if the true state was visible for at least `time` ms.
 *
 * @param time Time in milliseconds to require the value true to be visible before allowing false.
 *             Must be >= 0. If time === 0, no delay is applied (false emitted immediately).
 */
export function minVisibleMs(time: number): (source: Observable<boolean>) => Observable<boolean> {
  if (time < 0) throw new Error(`Time must be greater than or equal to 0. Received: ${time}`);

  if (time === 0) return (source: Observable<boolean>): Observable<boolean> => source.pipe(distinctUntilChanged());

  return (source: Observable<boolean>): Observable<boolean> =>
    source.pipe(
      distinctUntilChanged(),
      timestamp(),
      startWith<Timestamp<boolean>>({ value: false, timestamp: Date.now() }),
      pairwise(),
      switchMap(([prev, curr]: [Timestamp<boolean>, Timestamp<boolean>]) => {
        const wentFalse: boolean = prev.value && !curr.value;
        if (!wentFalse) return of(curr.value);

        const visibleFor: number = curr.timestamp - prev.timestamp;
        const remaining: number = Math.max(0, time - visibleFor);
        return remaining === 0 ? of(false) : timer(remaining).pipe(map(() => false));
      })
    );
}
