import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateHomeDeviceTable1735995890303 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _homeDevice: Table = new Table({
    name: 'home_device',
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'zigbeeDeviceId', type: 'varchar', isUnique: true },
      { name: 'deviceType', type: 'int' },
      { name: 'deviceName', type: 'varchar', length: '100' },
      { name: 'lastChanged', type: 'timestamp', isNullable: true },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._homeDevice);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._homeDevice);
  }
}
