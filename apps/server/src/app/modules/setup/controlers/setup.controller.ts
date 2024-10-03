import { Controller, Get } from '@nestjs/common';

import { SetupService } from '../services/setup.service';

@Controller('setup')
export class SetupController {
  public constructor(private readonly setupService: SetupService) {}

  @Get('ready')
  public isReady(): Promise<void> {
    return this.setupService.isConfigurationReady();
  }
}
