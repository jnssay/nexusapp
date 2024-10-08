/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Idea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `eventId` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Idea` table. All the data in the column will be lost.
  - The `id` column on the `Idea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `test` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `UserVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ideaId` column on the `UserVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DELETED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('YES', 'NO', 'MAYBE');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
ADD COLUMN     "status" "EventStatus" NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Idea" DROP CONSTRAINT "Idea_pkey",
DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "event_id" UUID,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ADD CONSTRAINT "Idea_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "test",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
DROP COLUMN "userId",
ADD COLUMN     "userId" UUID,
DROP COLUMN "ideaId",
ADD COLUMN     "ideaId" UUID,
ADD CONSTRAINT "UserVote_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "EventRSVPs" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "eventId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "chatId" TEXT NOT NULL,
    "status" "RSVPStatus" NOT NULL,

    CONSTRAINT "EventRSVPs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EventRSVPs" ADD CONSTRAINT "EventRSVPs_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRSVPs" ADD CONSTRAINT "EventRSVPs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
