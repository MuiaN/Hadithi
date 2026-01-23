/*
  Warnings:

  - The primary key for the `_ContentTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_ContentTags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Content_linkedPodcastId_key";

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "_ContentTags" DROP CONSTRAINT "_ContentTags_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_ContentTags_AB_unique" ON "_ContentTags"("A", "B");
