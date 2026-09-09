import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRunOnVacationToActionJob1788805307001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'action_job',
      new TableColumn({
        name: 'run_on_vacation',
        type: 'boolean',
        isNullable: false,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('action_job', 'run_on_vacation');
  }
}
