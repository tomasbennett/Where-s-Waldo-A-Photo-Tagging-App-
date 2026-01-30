import { NextFunction, Request, Response, Router } from "express";
import { IRequestGuess, RequestGuessSchema } from "../../../shared/features/play/models/IRequestGuess";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { IResponseGuess } from "../../../shared/features/play/models/IResponseGuess";
import { IStartGameResponse } from "../../../shared/features/play/models/IStartGameResponse";

export const router = Router();


router.post("/guess", async (req: Request<{}, {}, IRequestGuess>, res: Response<ICustomErrorResponse | IResponseGuess>, next: NextFunction) => {
    try {
        const body = req.body;

        const reqGuessResult = RequestGuessSchema.safeParse(body);
        if (!(reqGuessResult.success)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid request body for /guess endpoint: " + reqGuessResult.error.issues[0].message,
                ok: false
            });
        }

        const { gameSessionId, gameName, characterName, xCoordinate, yCoordinate } = reqGuessResult.data;

        const gameSession = await prisma.gameSession.findUnique({
            where: {
                id: gameSessionId
            },
            include: {
                gameSessionCharacters: {
                    include: {
                        character: true
                    }
                }
            }
        });

        if (!gameSession) {
            return res.status(404).json({
                status: 404,
                message: `Game session with id ${gameSessionId} not found`,
                ok: false
            });
        }

        if (gameSession.endedAt) {
            return res.status(400).json({
                status: 400,
                message: `Game session with session id of ${gameSession.id} has already finished`,
                ok: false
            });
        }

        const characterEntry = gameSession.gameSessionCharacters.find(entry => entry.character.name === characterName);

        if (!characterEntry) {
            return res.status(404).json({
                status: 404,
                message: `Character with name ${characterName} not found in game session ${gameSessionId}`,
                ok: false
            });
        }

        if (characterEntry.isFound) {
            return res.status(400).json({
                status: 400,
                message: `Character with name ${characterName} has already been found in this game session`,
                ok: false
            });
        }

        const character = characterEntry.character;


        const isCorrectGuess = (
            xCoordinate >= character.xCoordinate &&
            xCoordinate <= (character.xCoordinate + character.width) &&
            yCoordinate >= character.yCoordinate &&
            yCoordinate <= (character.yCoordinate + character.height)
        );


        if (!isCorrectGuess) {
            return res.status(200).json({
                status: 200,
                message: "Incorrect guess.",
                ok: true,
                isCorrect: false,
                isGameCompleted: false
            });
        }

        await prisma.gameSessionCharacter.update({
            where: {
                gameSessionId_characterId: {
                    gameSessionId: gameSession.id,
                    characterId: character.id
                }
            },
            data: {
                isFound: true,
                foundAt: new Date()
            }
        });

        // IF ALL CHARACTERS FOUND, MARK GAME SESSION AS COMPLETED
        const allCharactersFound = gameSession.gameSessionCharacters.every(entry => entry.isFound || entry.character.id === character.id);
        if (allCharactersFound) {
            const endedAt = new Date();

            const gameSessionFinished = await prisma.gameSession.update({
                where: {
                    id: gameSession.id
                },
                data: {
                    endedAt: endedAt
                }
            });

            

            const timeToCompleteMs: number = endedAt.getTime() - gameSessionFinished.startedAt.getTime();






            return res.status(200).json({
                status: 200,
                message: isCorrectGuess ? "Correct guess!" : "Incorrect guess.",
                ok: true,
                isCorrect: isCorrectGuess,
                isGameCompleted: true,
                timeToCompleteGameMs: timeToCompleteMs
            })
        }



        return res.status(200).json({
            status: 200,
            message: isCorrectGuess ? "Correct guess!" : "Incorrect guess.",
            ok: true,
            isCorrect: isCorrectGuess,
            isGameCompleted: false
        });




    } catch (error) {
        next(error);
    }
});


router.post("/start/:gameName", async (req: Request<{ gameName: string }>, res: Response<ICustomErrorResponse | IStartGameResponse>, next: NextFunction) => {
    try {
        const { gameName } = req.params;

        const game = await prisma.game.findUnique({
            where: {
                name: gameName
            },
            include: {
                characters: true
            }
        });

        if (!game) {
            return res.status(404).json({
                status: 404,
                message: `Game with name ${gameName} not found`,
                ok: false
            });
        }

        const newGameSession = await prisma.gameSession.create({
            data: {
                gameId: game.id,
                gameSessionCharacters: {
                    create: game.characters.map(character => ({
                        characterId: character.id,
                    }))
                }
            }
        });




        return res.status(200).json({
            status: 200,
            message: `Game session for ${gameName} started successfully`,
            ok: true,
            gameSessionId: newGameSession.id
        });

    } catch (error) {
        next(error);
    }
});


router.delete("/game/:gameSessionId", async (req: Request<{ gameSessionId: string }>, res: Response, next: NextFunction) => {
    const { gameSessionId } = req.params;

    try {
        await prisma.gameSession.delete({
            where: {
                id: gameSessionId
            }
        });

        return res.sendStatus(204);





    } catch (err) {
        next(err);

    }

});