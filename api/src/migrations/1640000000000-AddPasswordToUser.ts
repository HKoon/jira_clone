import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordToUser1640000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        isNullable: true,
        isSelect: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'password');
  }
}