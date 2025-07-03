/*
  Warnings:

  - The values [INCOME] on the enum `InventoryLogType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryLogType_new" AS ENUM ('INCREASE', 'DECREASE', 'SHRINKAGE');
ALTER TABLE "InventoryLog" ALTER COLUMN "type" TYPE "InventoryLogType_new" USING ("type"::text::"InventoryLogType_new");
ALTER TYPE "InventoryLogType" RENAME TO "InventoryLogType_old";
ALTER TYPE "InventoryLogType_new" RENAME TO "InventoryLogType";
DROP TYPE "InventoryLogType_old";
COMMIT;
