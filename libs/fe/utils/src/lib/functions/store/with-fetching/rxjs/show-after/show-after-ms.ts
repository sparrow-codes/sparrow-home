import { Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

/**
 * Emits true after the specified time.
 * @param time Time in milliseconds to wait before emitting true.
 * @returns An Observable that emits false immediately when the source emits false,
 *          and emits true after the specified time when the source emits true.
 */
export function showAfterMs(time: number): (source: Observable<boolean>) => Observable<boolean> {
  if (time < 0) throw new Error(`Time must be greater than or equal to 0. Received: ${time}`);

  if (time === 0) return (source: Observable<boolean>): Observable<boolean> => source.pipe(map(() => true));

  return (source: Observable<boolean>): Observable<boolean> =>
    source.pipe(
      distinctUntilChanged(),
      switchMap((value) => (value ? timer(time).pipe(map(() => true)) : of(false)))
    );
}
