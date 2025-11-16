import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateActionJobTable1762532633640 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'action_job',
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable('action_job');
    const foreignKey: TableForeignKey = table?.foreignKeys.find((fk) => fk.name === 'FK_action_job_task');
    if (foreignKey) {
      await queryRunner.dropForeignKey('action_job', foreignKey);
    }
    await queryRunner.dropTable('action_job', true);
  }
}
