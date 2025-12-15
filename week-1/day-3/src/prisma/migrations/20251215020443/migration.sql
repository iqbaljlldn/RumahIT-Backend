/*
  Warnings:

  - You are about to drop the `_OrderToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderToUser" DROP CONSTRAINT "_OrderToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderToUser" DROP CONSTRAINT "_OrderToUser_B_fkey";

-- DropTable
DROP TABLE "_OrderToUser";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
