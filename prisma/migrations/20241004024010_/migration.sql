/*
  Warnings:

  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `EventRSVPs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELETED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('YES', 'NO', 'MAYBE');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "status" "EventStatus" NOT NULL;

-- AlterTable
ALTER TABLE "EventRSVPs" DROP COLUMN "status",
ADD COLUMN     "status" "RSVPStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";

-- Grant table permissions
grant usage on schema "public" to anon;

grant usage on schema "public" to authenticated;

GRANT
SELECT
,
  INSERT,
UPDATE ON ALL TABLES IN SCHEMA "public" TO authenticated;

GRANT
SELECT
,
  INSERT,
UPDATE ON ALL TABLES IN SCHEMA "public" TO anon;