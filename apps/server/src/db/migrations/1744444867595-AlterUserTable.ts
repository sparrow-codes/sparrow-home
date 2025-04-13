import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '@sparrow-server/entities';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AlterUserTable1744444867595 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _newColumn: TableColumn = new TableColumn({ name: 'isActive', type: 'boolean', default: false });

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${this._configService.get(ConfigKey.DB_SCHEMA)}.user`);
    await queryRunner.addColumn(table, this._newColumn);
    await queryRunner.manager.update(User, { userRole: UserRole.OWNER }, { isActive: true });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${this._configService.get(ConfigKey.DB_SCHEMA)}.user`);
    await queryRunner.dropTable(table);
  }
}
