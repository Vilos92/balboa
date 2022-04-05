/*
  Warnings:

  - Added the required column `sender_user_id` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "sender_user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
