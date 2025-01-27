import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class MedicineTable1737994756759 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("rodando migration");
    await queryRunner.createTable(
      new Table({
        name: "Medicine",
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
            name: "description",
            type: "varchar",
            length: "200",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "int",
            isNullable: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
        ],
      }),
      true
    );
    await queryRunner.createForeignKey(
      "Medicine",
      new TableForeignKey({
        name: 'FK_Medicine_user_id',
        columnNames: ["userId"],
        referencedTableName: "Users", 
        referencedColumnNames: ["id"], 
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.dropForeignKey("Medicine", "FK_Medicine_user_id");

    await queryRunner.dropTable("Medicine");
  }
}
