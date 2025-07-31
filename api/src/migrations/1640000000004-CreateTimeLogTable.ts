import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateTimeLogTable1640000000004 implements MigrationInterface {
  name = 'CreateTimeLogTable1640000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'time_log',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'timeSpent',
            type: 'int',
            comment: 'Time spent in minutes',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'workDate',
            type: 'date',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'issueId',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['issueId'],
            referencedTableName: 'issue',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        indices: [
          {
            name: 'IDX_time_log_userId',
            columnNames: ['userId'],
          },
          {
            name: 'IDX_time_log_issueId',
            columnNames: ['issueId'],
          },
          {
            name: 'IDX_time_log_workDate',
            columnNames: ['workDate'],
          },
          {
            name: 'IDX_time_log_user_issue',
            columnNames: ['userId', 'issueId'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('time_log');
  }
}