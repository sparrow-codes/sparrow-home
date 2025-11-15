import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSetupTable1735995550693 implements MigrationInterface {
  private readonly _setup: Table = new Table({
    name: 'setup',
    columns: [{ name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' }],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._setup);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._setup);
  }
}
