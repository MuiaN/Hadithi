/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "audioUrl",
ADD COLUMN     "audioFile" BYTEA;
