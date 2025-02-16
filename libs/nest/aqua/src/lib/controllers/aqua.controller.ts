import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { AquaService } from '../services/aqua.service';
import { GetAquaPreferences } from './models/get-aqua-preferences';
import { SetAquaPreferences } from './models/set-aqua-preferences';
import { SetLightJobStatus } from './models/set-light-job-status';

@ApiTags('Aqua Preferences')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('aqua')
export class AquaController {
  public constructor(private readonly _aquaService: AquaService) {}

  @ApiOperation({ operationId: 'setAquaPreference' })
  @Put('preferences')
  public setAquaPreference(@Body() request: SetAquaPreferences): Promise<void> {
    return this._aquaService.setAquaPreferences(request);
  }

  @ApiOperation({ operationId: 'setAquaStatus' })
  @Put('status')
  public setAquaStatus(@Body() request: SetLightJobStatus): Promise<void> {
    return this._aquaService.setLightJobStatusLightJob(request.isActive);
  }

  @ApiOperation({ operationId: 'getAquaPreference' })
  @ApiResponse({ type: GetAquaPreferences })
  @Get('preferences')
  public getAquaPreference(): Promise<GetAquaPreferences> {
    return this._aquaService.getAquaPreferences();
  }
}
