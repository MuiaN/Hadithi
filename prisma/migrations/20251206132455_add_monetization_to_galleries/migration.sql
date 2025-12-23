-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "rejectionReason" TEXT;

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriptionTier" "SubscriptionTier";
