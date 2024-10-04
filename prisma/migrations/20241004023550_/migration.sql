/*
  Warnings:

  - Changed the type of `status` on the `EventRSVPs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('YES', 'NO', 'MAYBE');

-- AlterTable
ALTER TABLE "EventRSVPs" ALTER COLUMN "chatId" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
