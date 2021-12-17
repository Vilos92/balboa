/*
  Warnings:

  - Added the required column `hostUserId` to the `plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "plan" ADD COLUMN     "hostUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
