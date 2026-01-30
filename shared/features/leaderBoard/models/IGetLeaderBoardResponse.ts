import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { UsernameLeaderBoardSchema } from "./IUsernameLeaderBoard";
import { NumberFromStringSchema } from "../../util/models/INumber";

export const LeaderBoardEntrySchema = z.object({
    username: UsernameLeaderBoardSchema,
    timeInMilliseconds: NumberFromStringSchema
});

export type ILeaderBoardEntry = z.infer<typeof LeaderBoardEntrySchema>;





export const LeaderBoardEntriesArraySchema = z.array(LeaderBoardEntrySchema, { message: `Should contain an array of leader board entries!!!` })

export type ILeaderBoardEntriesArray = z.infer<typeof LeaderBoardEntriesArraySchema>;




export const GetLeaderBoardEntriesResponseSchema = APISuccessSchema.extend({
    leaderBoardEntries: LeaderBoardEntriesArraySchema
});


export type IGetLeaderBoardEntriesResponse = z.infer<typeof GetLeaderBoardEntriesResponseSchema>;