import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CloudConnectionService } from '../../cloud/services/cloud-connection/cloud-connection.service';

@Injectable()
export class CoreTaskService {
  public constructor(private readonly cloudService: CloudConnectionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public logoutOnMidnight(): void {
    this.cloudService.removeAuthToken();
    Logger.log('Resetting panasonic cloud authentication successfully!');
  }
}
