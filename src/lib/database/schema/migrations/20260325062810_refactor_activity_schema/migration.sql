/*
  Warnings:

  - Made the column `title` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `author` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `create_time` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_time` on table `activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `activity` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "car_id" TEXT,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "author" SET NOT NULL,
ALTER COLUMN "create_time" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "end_time" SET NOT NULL;
