/*
  Warnings:

  - You are about to drop the column `tickId` on the `TicketProduct` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TicketProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TicketProduct" DROP CONSTRAINT "TicketProduct_tickId_fkey";

-- AlterTable
ALTER TABLE "TicketProduct" DROP COLUMN "tickId",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "TicketProduct" ADD CONSTRAINT "TicketProduct_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
