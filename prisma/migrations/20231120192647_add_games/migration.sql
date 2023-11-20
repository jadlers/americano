/*
  Warnings:

  - You are about to drop the column `games` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "games",
ADD COLUMN     "numberOfGames" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "round" INTEGER NOT NULL,
    "team1" INTEGER[],
    "team2" INTEGER[],
    "score1" INTEGER NOT NULL,
    "score2" INTEGER NOT NULL,
    "tournamentId" UUID,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
