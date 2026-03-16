/*
  Warnings:

  - You are about to drop the column `ico` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `ico` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `ico` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "ico";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "ico";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "ico";
