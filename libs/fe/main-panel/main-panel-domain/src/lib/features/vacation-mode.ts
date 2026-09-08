import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStoreFeature, withProps, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { GetVacationModeResponseApiModel, SetupApiService } from '@sparrow-home/api';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

export function withVacationMode() {
  return signalStoreFeature(
    withState<{ isVacationMode: boolean }>({
      isVacationMode: false,
    }),
    withProps(
      (
        store,
        setupApiService = inject(SetupApiService),
        messageService = inject(MessageService),
        translateService = inject(TranslateService)
      ) => ({
        _setVacationMode(isVacationMode: boolean): Observable<void> {
          return setupApiService.setVacationMode({ body: { isVacationMode } }).pipe(
            tapResponse({
              next: () =>
                messageService.add({
                  summary: translateService.instant(
                    isVacationMode ? 'main_panel.vacation_mode_activated' : 'main_panel.vacation_mode_deactivated'
                  ),
                  severity: 'contrast',
                }),
              error: () =>
                messageService.add({
                  summary: translateService.instant('main_panel.set_vacation_mode_error'),
                  severity: 'error',
                }),
            })
          );
        },
        _getVacationMode(): Observable<GetVacationModeResponseApiModel> {
          return setupApiService.getVacationMode().pipe(
              tapResponse({
                next: (response) => patchState(store, { isVacationMode: response.isVacationMode }),
                error: () =>
                  messageService.add({
                    summary: translateService.instant('main_panel.fetch_vacation_mode_error'),
                    severity: 'error',
                  }),
              })
            );
        },
      })
    )
    
  );
}
