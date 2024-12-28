import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@sparrow-server/auth';

import { AquaService } from '../services/aqua.service';
import { GetAquaPreferences } from './models/get-aqua-preferences';
import { SetAquaPreferencesRequest } from './models/set-aqua-preferences-request';
import { SetLightJobStatusRequest } from './models/set-light-job-status-request';

@ApiTags('Aqua Preferences')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('aqua')
export class AquaController {
  public constructor(private readonly _aquaService: AquaService) {}

  @Put('preferences')
  public setPreferences(@Body() request: SetAquaPreferencesRequest): Promise<void> {
    return this._aquaService.setAquaPreferences(request);
  }

  @Put('status')
  public setAquaStatus(@Body() request: SetLightJobStatusRequest): Promise<void> {
    return this._aquaService.setLightJobStatusLightJob(request.isActive);
  }

  @ApiResponse({ type: GetAquaPreferences })
  @Get('preferences')
  public getPreferences(): Promise<GetAquaPreferences> {
    return this._aquaService.getAquaPreferences();
  }
}
