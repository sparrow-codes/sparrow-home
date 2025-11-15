import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SetupService } from '../services/setup.service';

@ApiTags('Setup')
@Controller('setup')
export class SetupController {
  public constructor(private readonly _setupService: SetupService) {}

  @ApiOperation({ operationId: 'isConfigurationReady' })
  @Get('ready')
  public isConfigurationReady(): Promise<void> {
    return this._setupService.isConfigurationReady();
  }
}
