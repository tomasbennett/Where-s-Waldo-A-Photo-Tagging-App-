import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";


export const StartGameResponseSchema = APISuccessSchema.extend({
    gameSessionId: z.string({ message: "Game session id should be a string!!!" }).uuid({ message: "Game session id should be a valid UUID!!!" }),
});


export type IStartGameResponse = z.infer<typeof StartGameResponseSchema>;
