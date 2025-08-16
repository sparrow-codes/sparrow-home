import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaskTable1690000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task',
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
          {
            name: 'startTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'endTime',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'atSunset',
            type: 'boolean',
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task');
  }
}
