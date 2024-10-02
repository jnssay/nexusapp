-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "chatId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Idea" ADD COLUMN     "eventId" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
