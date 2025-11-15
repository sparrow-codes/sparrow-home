import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { ActionFormService } from './action-form.service';
import { ActionForm } from './model/action-form';

describe('ActionFormService', () => {
  let service: ActionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ActionFormService] });
    service = TestBed.inject(ActionFormService);
  });

  describe('service init', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('ActionFormService - form validation', () => {
    it('should have a required "device" field', () => {
      const form: FormGroup<ActionForm> = service.form;
      form.controls.device.setValue(null as never);
      expect(form.controls.device.valid).toBe(false);
    });

    it('should have a required "action" field', () => {
      const form: FormGroup<ActionForm> = service.form;
      form.controls.action.setValue(null as never);
      expect(form.controls.action.valid).toBe(false);
    });

    it('should have a required "payload" field', () => {
      const form: FormGroup<ActionForm> = service.form;
      form.controls.payload.setValue(null as never);
      expect(form.controls.payload.valid).toBe(false);
    });

    it('should have a required "time" field', () => {
      const form: FormGroup<ActionForm> = service.form;
      form.controls.time.setValue(null as never);
      expect(form.controls.time.valid).toBe(false);
    });
  });
});
