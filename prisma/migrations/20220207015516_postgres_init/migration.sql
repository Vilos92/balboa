/*
  Warnings:

  - The primary key for the `plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_on_plan` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_plan_id_fkey";

-- AlterTable
ALTER TABLE "plan" DROP CONSTRAINT "plan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "plan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "plan_id_seq";

-- AlterTable
ALTER TABLE "user_on_plan" DROP CONSTRAINT "user_on_plan_pkey",
ALTER COLUMN "plan_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_on_plan_pkey" PRIMARY KEY ("plan_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_on_plan" ADD CONSTRAINT "user_on_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
