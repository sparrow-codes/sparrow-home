import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateHomeDeviceTable1735995890303 implements MigrationInterface {
  private readonly _homeDevice: Table = new Table({
    name: 'home_device',
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'zigbeeDeviceId', type: 'varchar', isUnique: true },
      { name: 'deviceType', type: 'int' },
      { name: 'deviceName', type: 'varchar', length: '100' },
      { name: 'zigbeeDeviceData', type: 'jsonb' },
      { name: 'lastChanged', type: 'timestamp', isNullable: true },
      { name: 'mainActionKey', type: 'varchar', isNullable: true },
      { name: 'mainParamKey', type: 'varchar', isNullable: true },
      { name: 'isOnMainPage', type: 'boolean', default: false },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._homeDevice);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._homeDevice);
  }
}
