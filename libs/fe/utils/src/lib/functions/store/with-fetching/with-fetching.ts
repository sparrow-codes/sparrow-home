import { toObservable } from '@angular/core/rxjs-interop';
import { signalStoreFeature, withProps, withState } from '@ngrx/signals';

import { minVisibleMs } from './rxjs/min-visible/min-visible';
import { showAfterMs } from './rxjs/show-after/show-after-ms';
import { UI_LATENCY } from './tokens/ui-latency/ui-latency';

export function withFetching() {
  return signalStoreFeature(
    withState<{ _isLoading: boolean; _isRefreshing: boolean }>({ _isLoading: false, _isRefreshing: false }),
    withProps((store) => ({
      isRefreshing$: toObservable(store._isRefreshing).pipe(
        showAfterMs(UI_LATENCY.progress.showDelay),
        minVisibleMs(UI_LATENCY.progress.minVisible)
      ),
      isLoading$: toObservable(store._isLoading).pipe(
        showAfterMs(UI_LATENCY.skeleton.showDelay),
        minVisibleMs(UI_LATENCY.skeleton.minVisible)
      ),
    }))
  );
}
