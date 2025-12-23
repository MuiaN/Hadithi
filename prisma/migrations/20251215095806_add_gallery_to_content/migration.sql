/*
  Warnings:

  - The `coverImage` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[linkedPodcastId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContentStatus" ADD VALUE 'PENDING_APPROVAL';
ALTER TYPE "ContentStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "galleryId" TEXT,
ADD COLUMN     "linkedPodcastId" TEXT,
DROP COLUMN "coverImage",
ADD COLUMN     "coverImage" BYTEA;

-- CreateIndex
CREATE UNIQUE INDEX "Content_linkedPodcastId_key" ON "Content"("linkedPodcastId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_linkedPodcastId_fkey" FOREIGN KEY ("linkedPodcastId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
