import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { DeviceType } from '@sparrow-home/utils';

import { CreateDeviceFormService } from './create-device-form.service';
import { CreateDeviceForm } from './model/create-device-form';

describe('CreateDeviceFormService', () => {
  let service: CreateDeviceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CreateDeviceFormService] });
    service = TestBed.inject(CreateDeviceFormService);
  });

  describe('service init', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize form with expected default values', () => {
      const form: FormGroup<CreateDeviceForm> = service.form;

      expect(form.controls.deviceType.value).toBe(DeviceType.OTHER);
      expect(form.controls.name.value).toBe('');
    });
  });

  describe('form validation', () => {
    it('should have required deviceType', () => {
      const form: FormGroup<CreateDeviceForm> = service.form;

      form.controls.deviceType.setValue(null);

      expect(form.controls.deviceType.valid).toBe(false);
      expect(form.controls.deviceType.errors?.['required']).toBe(true);
    });

    it('should have required name', () => {
      const form: FormGroup<CreateDeviceForm> = service.form;

      form.controls.name.setValue('');

      expect(form.controls.name.valid).toBe(false);
      expect(form.controls.name.errors?.['required']).toBe(true);
    });

    it('should enforce name maxLength = 100', () => {
      const form: FormGroup<CreateDeviceForm> = service.form;

      form.controls.name.setValue('a'.repeat(101));

      expect(form.controls.name.valid).toBe(false);
      expect(form.controls.name.errors?.['maxlength']).toBeTruthy();
    });

    it('should be valid for correct values', () => {
      const form: FormGroup<CreateDeviceForm> = service.form;

      form.controls.deviceType.setValue(DeviceType.SIREN);
      form.controls.name.setValue('Living room sensor');

      expect(form.valid).toBe(true);
    });
  });
});
