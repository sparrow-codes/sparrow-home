import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddVacationModeToSetupTable1788805307000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable: Table | undefined = await queryRunner.getTable('user');
    const setupForeignKey: TableForeignKey | undefined = userTable?.foreignKeys.find(
      (foreignKey) => foreignKey.columnNames.length === 1 && foreignKey.columnNames[0] === 'setupId'
    );

    if (userTable && setupForeignKey) {
      await queryRunner.dropForeignKey(userTable, setupForeignKey);
    }

    await queryRunner.dropColumn('user', 'setupId');
    await queryRunner.addColumn(
      'setup',
      new TableColumn({
        name: 'isVacationMode',
        type: 'boolean',
        isNullable: false,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('setup', 'isVacationMode');

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'setupId',
        type: 'int',
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['setupId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'setup',
        onDelete: 'CASCADE',
      })
    );
  }
}