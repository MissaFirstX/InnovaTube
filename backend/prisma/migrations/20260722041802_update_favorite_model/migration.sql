/*
  Warnings:

  - Added the required column `channelTitle` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "channelTitle" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
