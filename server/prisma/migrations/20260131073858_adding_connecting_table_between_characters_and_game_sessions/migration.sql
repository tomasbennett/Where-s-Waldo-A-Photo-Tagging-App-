/*
  Warnings:

  - You are about to drop the column `gameId` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId,name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gameSessionId]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameSessionId` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LeaderboardEntry" DROP CONSTRAINT "LeaderboardEntry_gameId_fkey";

-- AlterTable
ALTER TABLE "LeaderboardEntry" DROP COLUMN "gameId",
DROP COLUMN "position",
ADD COLUMN     "gameSessionId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "GameSessionCharacter" (
    "id" UUID NOT NULL,
    "isFound" BOOLEAN NOT NULL DEFAULT false,
    "foundAt" TIMESTAMP(3),
    "gameSessionId" UUID NOT NULL,
    "characterId" UUID NOT NULL,

    CONSTRAINT "GameSessionCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSessionCharacter_gameSessionId_characterId_key" ON "GameSessionCharacter"("gameSessionId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_gameId_name_key" ON "Character"("gameId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_gameSessionId_key" ON "LeaderboardEntry"("gameSessionId");

-- AddForeignKey
ALTER TABLE "GameSessionCharacter" ADD CONSTRAINT "GameSessionCharacter_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSessionCharacter" ADD CONSTRAINT "GameSessionCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
