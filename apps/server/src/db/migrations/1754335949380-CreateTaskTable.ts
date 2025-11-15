import { ConfigService } from '@nestjs/config';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaskTable1690000000000 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _dbSchema: string = this._configService.get<string>('DB_SCHEMA');

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
        schema: this._dbSchema,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task');
  }
}
