import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateCloudPreferencesTable1735996227082 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _cloudPreferencesTable: Table = new Table({
    name: 'cloud_preferences',
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'isEverydayWaterHeatOn', type: 'boolean', default: false },
      { name: 'circularPumpStartTime', type: 'timestamp', isNullable: true },
      { name: 'circularPumpEndTime', type: 'timestamp', isNullable: true },
      { name: 'isCircularPumpActive', type: 'boolean', default: false },
      { name: 'tuyaDeviceId', type: 'int', isNullable: true },
    ],
  });
  private readonly _tuyaDeviceForeignKey: TableForeignKey = new TableForeignKey({
    columnNames: ['tuyaDeviceId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'tuya_device',
    onDelete: 'CASCADE',
    referencedSchema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._cloudPreferencesTable);
    await queryRunner.createForeignKey(this._cloudPreferencesTable, this._tuyaDeviceForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this._cloudPreferencesTable, this._tuyaDeviceForeignKey);
    await queryRunner.dropTable(this._cloudPreferencesTable);
  }
}
