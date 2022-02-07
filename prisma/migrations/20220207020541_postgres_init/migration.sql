/*
  Warnings:

  - The primary key for the `rocky_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_on_plan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";

-- DropForeignKey
ALTER TABLE "plan" DROP CONSTRAINT "plan_host_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_user_id_fkey";

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "plan" ALTER COLUMN "host_user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "rocky_user" DROP CONSTRAINT "rocky_user_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "rocky_user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "rocky_user_id_seq";

-- AlterTable
ALTER TABLE "session" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_pkey",
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_on_plan_pkey" PRIMARY KEY ("plan_id", "user_id");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "rocky_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "rocky_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_on_plan" ADD CONSTRAINT "user_on_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
