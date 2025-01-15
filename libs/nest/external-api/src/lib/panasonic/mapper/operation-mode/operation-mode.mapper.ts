export class OperationModeMapper {
  public static map(isWaterOn: boolean, isHeatOn: boolean): number | undefined {
    if (!isWaterOn && !isHeatOn) {
      return undefined;
    }

    if (isWaterOn && !isHeatOn) {
      return 0;
    }

    if (isHeatOn) {
      return -1;
    }

    return undefined;
  }
}
