import { NextFunction, Request, Response, Router } from "express";
import { INewLeaderBoardEntryReq, NewLeaderBoardEntryReq } from "../../../shared/features/leaderBoard/models/INewLeaderBoardEntryReq";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";
import { prisma } from "../db/prisma";
import { GetLeaderBoardQueryParamsSchema, IGetLeaderBoardQueryParams } from "../../../shared/features/leaderBoard/models/IGetLeaderBoardQueryParams";
import { IGetLeaderBoardEntriesResponse } from "../../../shared/features/leaderBoard/models/IGetLeaderBoardResponse";


export const router = Router();

router.get("/leaderboard", async (req: Request<{}, {}, {}, IGetLeaderBoardQueryParams>, res: Response<ICustomErrorResponse | IGetLeaderBoardEntriesResponse>, next: NextFunction) => {
    const queryParams = req.query;

    try {

        const queryParamsLeaderBoardResult = GetLeaderBoardQueryParamsSchema.safeParse(queryParams);
        if (!(queryParamsLeaderBoardResult.success)) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: `There was an error with your leader board query parameters for the request: ` + queryParamsLeaderBoardResult.error.issues[0].message
            });
        }

        const { limit, gameId, offset } = queryParamsLeaderBoardResult.data;

        const leaderBoardEntries = await prisma.leaderboardEntry.findMany({
            where: {
                gameSession: {
                    gameId: gameId
                }
            },
            take: limit,
            orderBy: {
                timeInMilliseconds: "asc"
            },
            skip: offset
        });

        const length = leaderBoardEntries.length;

        return res.status(200).json({
            ok: true,
            status: 200,
            message: `Successfully returning ${length} leaderboard entries`,
            leaderBoardEntries
        });


        
    } catch (error) {
        next(error);
    }


});




router.post("/leaderboard", async (req: Request<{}, {}, INewLeaderBoardEntryReq>, res: Response<ICustomErrorResponse | ICustomSuccessMessage>, next: NextFunction) => {
    try {
        
        const body = req.body;

        const newLeaderBoardEntryResult = NewLeaderBoardEntryReq.safeParse(body);
        if (!(newLeaderBoardEntryResult.success)) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: newLeaderBoardEntryResult.error.issues[0].message
            });

        }

        const { username, gameSessionId } = newLeaderBoardEntryResult.data;

        const gameSession = await prisma.gameSession.findUnique({
            where: {
                id: gameSessionId
            }
        });

        if (!gameSession) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: `Could not find game session with id ${gameSessionId}`
            });
        }

        if (!(gameSession.endedAt)) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: `The game session with id ${gameSessionId} is still in play`
            });
        }

        const timeToCompleteInMs: number = gameSession.endedAt.getTime() - gameSession.startedAt.getTime();

        



        const newLeaderBoardEntry = await prisma.leaderboardEntry.create({
            data: {
                username: username,
                timeInMilliseconds: timeToCompleteInMs,
                gameSessionId: gameSessionId
            }
        });



        return res.status(201).json({
            ok: true,
            status: 201,
            message: `Successfully created new leader board entry`
        });





    } catch (error) {
        next(error);

    }
});