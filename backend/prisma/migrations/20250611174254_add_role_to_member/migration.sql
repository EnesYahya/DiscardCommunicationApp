/*
  Warnings:

  - You are about to drop the column `file` on the `DirectMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'GUEST';
