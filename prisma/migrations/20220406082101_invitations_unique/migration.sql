/*
  Warnings:

  - A unique constraint covering the columns `[plan_id,email]` on the table `invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invitation_plan_id_email_key" ON "invitation"("plan_id", "email");
