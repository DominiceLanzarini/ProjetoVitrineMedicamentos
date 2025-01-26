import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserTable1737921980273 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("rodando migraion");
    await queryRunner.createTable(
      new Table({
        name: "Users",
        columns: [
          {
            name: "id",
            isGenerated: true,
            generationStrategy: "increment",
            isPrimary: true,
            type: "int",
          },
          {
            name: "name",
            type: "varchar",
            length: "150",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "150",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "200",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Users");
  }
}
