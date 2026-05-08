import { Expose } from '@sparrow-server/shared';

import { DeviceAction } from '../../../model/device-profile';
import { mapExposesToActions } from './to-actions';

const switchExposes: Expose[] = JSON.parse(
  '[{"type":"switch","features":[{"type":"binary","name":"state","property":"state","access":7,"value_on":"ON","value_off":"OFF","value_toggle":"TOGGLE"}]},{"type":"enum","name":"power_on_behavior","property":"power_on_behavior","access":7,"values":["off","on","toggle","previous"],"category":"config"},{"type":"numeric","name":"power","property":"power","access":5,"unit":"W"},{"type":"numeric","name":"voltage","property":"voltage","access":5,"unit":"V"},{"type":"numeric","name":"current","property":"current","access":5,"unit":"A"},{"type":"numeric","name":"energy","property":"energy","access":5,"unit":"kWh"}]'
);

const sensorExposes: Expose[] = JSON.parse(
  '[{"type":"numeric","name":"battery","property":"battery","access":5,"unit":"%","value_min":0,"value_max":100},{"type":"numeric","name":"temperature","property":"temperature","access":5,"unit":"°C"},{"type":"numeric","name":"humidity","property":"humidity","access":5,"unit":"%"},{"type":"numeric","name":"temperature_calibration","property":"temperature_calibration","access":7,"unit":"°C","value_min":-50,"value_max":50},{"type":"numeric","name":"humidity_calibration","property":"humidity_calibration","access":7,"unit":"%","value_min":-50,"value_max":50}]'
);

describe('toActions', () => {
  it('should parse switch exposes', () => {
    const result: DeviceAction[] = mapExposesToActions(switchExposes);
    expect(result.length).toBe(2);
  });

  it('should parse sensor exposes', () => {
    const result: DeviceAction[] = mapExposesToActions(sensorExposes);
    expect(result.length).toBe(2);
  });
});
