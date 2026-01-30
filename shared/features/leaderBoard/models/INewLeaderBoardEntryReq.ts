import z from "zod";
import { maxUsernameLength, minUsernameLength, usernameRegex } from "../constants";
import { UsernameLeaderBoardSchema } from "./IUsernameLeaderBoard";


export const NewLeaderBoardEntryFrontend = z.object({
    username: UsernameLeaderBoardSchema
})


export type INewLeaderBoardEntryFrontend = z.infer<typeof NewLeaderBoardEntryFrontend>;



export const NewLeaderBoardEntryReq = NewLeaderBoardEntryFrontend.extend({
    gameSessionId: z.string({ message: "Game session id must be of type string!!!" })
});


export type INewLeaderBoardEntryReq = z.infer<typeof NewLeaderBoardEntryReq>;