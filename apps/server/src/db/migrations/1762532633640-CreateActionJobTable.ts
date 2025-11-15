import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateActionJobTable1762532633640 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _dbSchema: string = this._configService.get<string>(ConfigKey.DB_SCHEMA);

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'action_job',
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
            name: 'assignedDeviceId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payload',
            type: 'json',
          },
          {
            name: 'execution_time',
            type: 'timestamp',
          },
          {
            name: 'taskId',
            type: 'int',
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      'action_job',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        referencedSchema: this._dbSchema,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable(`${this._dbSchema}.action_job`);
    const foreignKey: TableForeignKey = table?.foreignKeys.find((fk) => fk.name === 'FK_action_job_task');
    if (foreignKey) {
      await queryRunner.dropForeignKey(`${this._dbSchema}.action_job`, foreignKey);
    }
    await queryRunner.dropTable(`${this._dbSchema}.action_job`, true);
  }
}
