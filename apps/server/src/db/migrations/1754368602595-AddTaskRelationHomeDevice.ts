import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddTaskRelationToHomeDevice1690000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'home_device',
      new TableColumn({
        name: 'taskId',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'home_device',
      new TableForeignKey({
        columnNames: ['taskId'],
        referencedTableName: 'task',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table: Table = await queryRunner.getTable('home_device');
    const foreignKey: TableForeignKey = table.foreignKeys.find((fk) => fk.columnNames.includes('task_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('home_device', foreignKey);
    }
    await queryRunner.dropColumn('home_device', 'taskId');
  }
}
