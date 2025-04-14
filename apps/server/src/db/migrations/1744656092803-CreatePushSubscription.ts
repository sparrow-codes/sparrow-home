import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreatePushSubscription1744656092803 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _dbSchema: string = this._configService.get<string>(ConfigKey.DB_SCHEMA);

  private readonly _pushSubscriptionClient: Table = new Table({
    name: 'push_subscription_client',
    schema: this._dbSchema,
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'endpoint', type: 'varchar', length: '300' },
      { name: 'p256dh', type: 'varchar' },
      { name: 'auth', type: 'varchar' },
    ],
  });
  private readonly _pushSubscriptionForeignKey: TableForeignKey = new TableForeignKey({
    columnNames: ['pushSubscriptionClientId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'push_subscription_client',
    onDelete: 'CASCADE',
    referencedSchema: this._dbSchema,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable: Table = await queryRunner.getTable(`${this._dbSchema}.user`);
    await queryRunner.addColumn(
      userTable,
      new TableColumn({ name: 'pushSubscriptionClientId', type: 'int', isNullable: true })
    );

    await queryRunner.createTable(this._pushSubscriptionClient);
    await queryRunner.createForeignKey(userTable, this._pushSubscriptionForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userTable: Table = await queryRunner.getTable(`${this._dbSchema}.user`);
    await queryRunner.dropColumn(userTable, 'pushSubscriptionClientId');
    await queryRunner.dropForeignKey(userTable, this._pushSubscriptionForeignKey);
    await queryRunner.dropTable(this._pushSubscriptionClient);
  }
}
