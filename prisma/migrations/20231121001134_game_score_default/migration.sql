-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "score1" DROP NOT NULL,
ALTER COLUMN "score1" SET DEFAULT 0,
ALTER COLUMN "score2" DROP NOT NULL,
ALTER COLUMN "score2" SET DEFAULT 0;