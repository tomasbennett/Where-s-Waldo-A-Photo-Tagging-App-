import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";

export const ResponseGuessSchema = APISuccessSchema.extend({
    isCorrect: z.boolean({ message: "isCorrect field is required and must be a boolean" }),
});


export type IResponseGuess = z.infer<typeof ResponseGuessSchema>;