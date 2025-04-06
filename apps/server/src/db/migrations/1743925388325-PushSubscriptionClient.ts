import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PushSubscriptionClient1743925388325 implements MigrationInterface {
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._pushSubscriptionClient);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._pushSubscriptionClient);
  }
}
