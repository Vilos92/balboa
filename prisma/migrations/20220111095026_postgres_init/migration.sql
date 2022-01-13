/*
  Warnings:

  - You are about to drop the column `hostUserId` on the `plan` table. All the data in the column will be lost.
  - The primary key for the `user_on_plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `planId` on the `user_on_plan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_on_plan` table. All the data in the column will be lost.
  - Added the required column `host_user_id` to the `plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_id` to the `user_on_plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_on_plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "plan" DROP CONSTRAINT "plan_hostUserId_fkey";

-- DropForeignKey
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_planId_fkey";

-- DropForeignKey
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_userId_fkey";

-- AlterTable
ALTER TABLE "plan" DROP COLUMN "hostUserId",
ADD COLUMN     "host_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_pkey",
DROP COLUMN "planId",
DROP COLUMN "userId",
ADD COLUMN     "plan_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_on_plan_pkey" PRIMARY KEY ("plan_id", "user_id");

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_on_plan" ADD CONSTRAINT "user_on_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_on_plan" ADD CONSTRAINT "user_on_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
