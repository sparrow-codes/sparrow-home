import { ConfigService } from '@nestjs/config';
import { AlarmPreferences, User, UserRole } from '@sparrow-server/entities';
import { ConfigKey } from '@sparrow-server/shared';
import { MigrationInterface, QueryRunner, SelectQueryBuilder, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateAlarmPreferences1743010222859 implements MigrationInterface {
  private readonly _configService: ConfigService = new ConfigService();
  private readonly _dbSchema: string = this._configService.get<string>(ConfigKey.DB_SCHEMA);
  private readonly _alarmPreferences: Table = new Table({
    name: 'alarm_preferences',
    schema: this._dbSchema,
    columns: [
      { name: 'id', type: 'int', isPrimary: true, generationStrategy: 'increment', isGenerated: true },
      { name: 'isActive', type: 'boolean', default: false },
    ],
  });
  private readonly _alarmPreferencesForeignKey: TableForeignKey = new TableForeignKey({
    columnNames: ['alarmPreferencesId'],
    referencedColumnNames: ['id'],
    referencedTableName: 'aqua_preferences',
    onDelete: 'CASCADE',
    referencedSchema: this._dbSchema,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userTable: Table = await queryRunner.getTable(`${this._dbSchema}.user`);
    await queryRunner.addColumn(
      userTable,
      new TableColumn({ name: 'alarmPreferencesId', type: 'int', isNullable: true })
    );
    await queryRunner.createTable(this._alarmPreferences);
    await queryRunner.createForeignKey(userTable, this._alarmPreferencesForeignKey);

    const queryBuilder: SelectQueryBuilder<unknown> = queryRunner.manager.createQueryBuilder();
    await queryBuilder.insert().into(`${this._dbSchema}.alarm_preferences`).values({ isActive: false }).execute();

    const alarmPreferencesList: AlarmPreferences[] = await queryRunner.manager.find<AlarmPreferences>(
      AlarmPreferences,
      {}
    );
    await queryRunner.manager.update(User, { userRole: UserRole.OWNER }, { alarmPreferences: alarmPreferencesList[0] });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userTable: Table = await queryRunner.getTable(`${this._dbSchema}.user`);
    await queryRunner.dropForeignKey(userTable, this._alarmPreferencesForeignKey);
    await queryRunner.dropTable(this._alarmPreferences);
  }
}
