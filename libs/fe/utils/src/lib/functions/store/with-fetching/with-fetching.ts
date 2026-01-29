import { toObservable } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { debounceTime } from 'rxjs';

type WithFetchingState = { _isLoading: boolean; _isRefreshing: boolean };

export function withFetching() {
  return signalStoreFeature(
    withState<{ _isLoading: boolean; _isRefreshing: boolean }>({ _isLoading: false, _isRefreshing: false }),
    withProps((store) => ({
      isRefreshing$: toObservable(store._isRefreshing).pipe(debounceTime(500)),
      isLoading$: toObservable(store._isLoading).pipe(debounceTime(500)),
    }))
  );
}

export function withLoading(): Pick<WithFetchingState, '_isLoading'> {
  return { _isLoading: true };
}

export function withoutLoading(): Pick<WithFetchingState, '_isLoading'> {
  return { _isLoading: false };
}

export function withRefreshing(): Pick<WithFetchingState, '_isRefreshing'> {
  return { _isRefreshing: true };
}

export function withoutRefreshing(): Pick<WithFetchingState, '_isRefreshing'> {
  return { _isRefreshing: false };
}
