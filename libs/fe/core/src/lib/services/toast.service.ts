import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'contrast';

export interface ToastMessage {
  summary: string;
  detail?: string;
  severity?: ToastSeverity;
  life?: number;
}

const SEVERITY_COLOR: Record<ToastSeverity, string> = {
  success: 'success',
  info: 'primary',
  warn: 'warning',
  error: 'danger',
  contrast: 'dark',
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toastController: ToastController = inject(ToastController);

  public async add({ summary, detail, severity = 'info', life = 3000 }: ToastMessage): Promise<void> {
    const toast: HTMLIonToastElement = await this._toastController.create({
      header: detail ? summary : undefined,
      message: detail ?? summary,
      color: SEVERITY_COLOR[severity],
      position: 'bottom',
      duration: life,
    });
    await toast.present();
  }
}
