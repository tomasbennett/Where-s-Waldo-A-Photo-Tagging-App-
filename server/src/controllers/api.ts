import { NextFunction, Request, Response, Router } from "express";
import { IRequestGuess, RequestGuessSchema } from "../../../shared/features/play/models/IRequestGuess";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { IResponseGuess } from "../../../shared/features/play/models/IResponseGuess";

export const router = Router();


router.post("/guess", async (req: Request<{}, {}, IRequestGuess>, res: Response<ICustomErrorResponse | IResponseGuess>, next: NextFunction) => {
    try {
        const body = req.body;

        const reqGuessResult = RequestGuessSchema.safeParse(body);
        if (!(reqGuessResult.success)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid request body for /guess endpoint",
                ok: false
            });
        }

        const { gameName, characterName, xCoordinate, yCoordinate } = reqGuessResult.data;

        const game = await prisma.game.findUnique({
            where: {
                name: gameName
            }
        });

        if (!game) {
            return res.status(404).json({
                status: 404,
                message: `Game with name ${gameName} not found`,
                ok: false
            });
        }

        const character = await prisma.character.findUnique({
            where: {
                gameId_name: {
                    gameId: game.id,
                    name: characterName
                }
            }
        });

        if (!character) {
            return res.status(404).json({
                status: 404,
                message: `Character with name ${characterName} not found in game ${gameName}`,
                ok: false
            });
        }

        const isCorrectGuess = (
            xCoordinate >= character.xCoordinate &&
            xCoordinate <= (character.xCoordinate + character.width) &&
            yCoordinate >= character.yCoordinate &&
            yCoordinate <= (character.yCoordinate + character.height)
        );

        return res.status(200).json({
            status: 200,
            message: isCorrectGuess ? "Correct guess!" : "Incorrect guess.",
            ok: true,
            isCorrect: isCorrectGuess
        });




    } catch (error) {
        next(error);
    }
});