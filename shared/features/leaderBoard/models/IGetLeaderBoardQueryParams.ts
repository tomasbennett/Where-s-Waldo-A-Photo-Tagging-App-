import z from "zod";
import { NumberFromStringSchema } from "../../util/models/INumber";


export const GetLeaderBoardQueryParamsSchema = z.object({
    gameId: z
        .string({ message: `There must be a game name present for each leaderboard in the query parameters!!!` })
        .min(1, { message: `The min length for the game name should be one!!!` }),
    limit: NumberFromStringSchema.default(10),
    offset: NumberFromStringSchema.default(0)
});



export type IGetLeaderBoardQueryParams = z.infer<typeof GetLeaderBoardQueryParamsSchema>;