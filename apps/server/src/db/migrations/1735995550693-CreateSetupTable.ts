import { ConfigService } from '@nestjs/config';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSetupTable1735995550693 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();

  private readonly _setup: Table = new Table({
    name: 'setup',
    schema: this._configService.get<string>(ConfigKey.DB_SCHEMA),
    columns: [
      { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
      { name: 'lat', type: 'decimal', isNullable: true },
      { name: 'lng', type: 'decimal', isNullable: true },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this._setup);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this._setup);
  }
}
