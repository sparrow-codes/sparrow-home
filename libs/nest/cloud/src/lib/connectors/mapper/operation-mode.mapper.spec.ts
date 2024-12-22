import { OperationModeMapper } from './operation-mode.mapper';

describe('OperationModeMapper', () => {
  let result: number | undefined;

  it('should return undefined on water and heat false', () => {
    result = OperationModeMapper.map(false, false);
    expect(result).toBe(undefined);
  });

  it('should return 0 on water on and heat off', () => {
    result = OperationModeMapper.map(true, false);
    expect(result).toBe(0);
  });

  it('should return -1 on water on and heat on', () => {
    result = OperationModeMapper.map(true, true);
    expect(result).toBe(-1);
  });

  it('should return -1 on water off and heat on', () => {
    result = OperationModeMapper.map(false, true);
    expect(result).toBe(-1);
  });
});
