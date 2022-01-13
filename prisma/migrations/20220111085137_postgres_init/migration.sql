/*
  Warnings:

  - You are about to drop the `UsersOnPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnPlan" DROP CONSTRAINT "UsersOnPlan_planId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnPlan" DROP CONSTRAINT "UsersOnPlan_userId_fkey";

-- DropTable
DROP TABLE "UsersOnPlan";

-- CreateTable
CREATE TABLE "users_on_plan" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "users_on_plan_pkey" PRIMARY KEY ("planId","userId")
);

-- AddForeignKey
ALTER TABLE "users_on_plan" ADD CONSTRAINT "users_on_plan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_on_plan" ADD CONSTRAINT "users_on_plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "rocky_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
