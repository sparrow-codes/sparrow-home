import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDeviceLastState1768117412317 implements MigrationInterface {
  private readonly _table: Table = new Table({
    name: 'device_last_state',
    columns: [
      {
        name: 'device_id',
        type: 'varchar',
        isPrimary: true,
        isUnique: true,
        isGenerated: false,
      },
      {
        name: 'state',
        type: 'jsonb',
        isNullable: false,
      },
      {
        name: 'state_hash',
        type: 'varchar',
        isNullable: false,
      },
      {
        name: 'updated_at',
        type: 'timestamptz',
        isNullable: false,
        default: 'now()',
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._table);
    await queryRunner.createIndex(
      this._table,
      new TableIndex({ name: 'idx_device_last_state_updated_at', columnNames: ['updated_at'] })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._table);
  }
}
