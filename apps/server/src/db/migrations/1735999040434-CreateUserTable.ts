import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateUserTable1735999040434 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _userTable: Table = new Table({
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    name: 'user',
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'firstName', type: 'varchar' },
      { name: 'lastName', type: 'varchar', isNullable: true },
      { name: 'password', type: 'varchar' },
      { name: 'email', type: 'varchar' },
      { name: 'userRole', type: 'int' },
      { name: 'setupId', type: 'int' },
      { name: 'isActive', type: 'boolean', default: false },
    ],
  });

  private readonly _setupForeignKey: TableForeignKey = new TableForeignKey({
    columnNames: ['setupId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'setup',
    onDelete: 'CASCADE',
    referencedSchema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._userTable);
    await queryRunner.createForeignKey(this._userTable, this._setupForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this._userTable, this._setupForeignKey);
    await queryRunner.dropTable(this._userTable);
  }
}
