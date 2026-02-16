-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "youtubeUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
