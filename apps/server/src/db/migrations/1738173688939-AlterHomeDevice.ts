import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AlterHomeDevice1738173688939 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _columns: TableColumn[] = [
    new TableColumn({ name: 'temperature', type: 'decimal', isNullable: true }),
    new TableColumn({ name: 'battery', type: 'int', isNullable: true }),
    new TableColumn({ name: 'signalStrength', type: 'int', isNullable: true }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${this._configService.get(ConfigKey.DB_SCHEMA)}.home_device`);
    await queryRunner.addColumns(table, this._columns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(`${this._configService.get(ConfigKey.DB_SCHEMA)}.home_device`, this._columns);
  }
}
