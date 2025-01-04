import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAquaPreferencesTable1735998874554 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _aquaPreferencesTable: Table = new Table({
    name: 'aqua_preferences',
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'lightStartTime', type: 'timestamp', isNullable: true },
      { name: 'lightEndTime', type: 'timestamp', isNullable: true },
      { name: 'isActive', type: 'boolean', default: false },
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
    await queryRunner.createTable(this._aquaPreferencesTable);
    await queryRunner.createForeignKey(this._aquaPreferencesTable, this._tuyaDeviceForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this._aquaPreferencesTable, this._tuyaDeviceForeignKey);
    await queryRunner.dropTable(this._aquaPreferencesTable);
  }
}
