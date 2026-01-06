import { patchState, signalStoreFeature, withComputed, withMethods, withState } from '@ngrx/signals';

type RefreshingObjectsState<T> = {
  _refreshingObjects: T[];
};

export function withRefreshingObjects<T>() {
  return signalStoreFeature(
    withState<RefreshingObjectsState<T>>({
      _refreshingObjects: [],
    }),
    withComputed((store) => ({
      refreshingObjects: (): Set<T> => new Set(store._refreshingObjects()),
    })),
    withMethods((store) => ({
      _refreshObject: (value: T): void => {
        patchState(store, withRefreshingObject(store._refreshingObjects(), value));

        setTimeout(() => {
          patchState(store, withoutRefreshingObject(store._refreshingObjects(), value));
        }, 1250);
      },
    }))
  );
}

function withRefreshingObject<T>(objects: T[], value: T): RefreshingObjectsState<T> {
  return { _refreshingObjects: [...objects, value] };
}

function withoutRefreshingObject<T>(objects: T[], value: T): RefreshingObjectsState<T> {
  return { _refreshingObjects: objects.filter((obj: T) => obj !== value) };
}
