import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTuyaDeviceTable1735995890303 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _tuyaDevice: Table = new Table({
    name: 'tuya_device',
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'tuyaDeviceId', type: 'varchar', isUnique: true },
      { name: 'deviceType', type: 'int' },
      { name: 'deviceName', type: 'varchar', length: '100' },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._tuyaDevice);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._tuyaDevice);
  }
}
