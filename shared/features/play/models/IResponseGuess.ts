import z from "zod";
import { APISuccessSchema } from "../../api/models/APISuccessResponse";
import { NumberFromStringSchema } from "../../util/models/INumber";

const BaseResponseGuessSchema = APISuccessSchema.extend({
    isCorrect: z.boolean({ message: "isCorrect field is required and must be a boolean" }),
});


const ResponseCompleteGameSchema = BaseResponseGuessSchema.extend({
    isGameCompleted: z.literal(true),
    timeToCompleteGameMs: NumberFromStringSchema
});


const ResponseInProgressSchema = BaseResponseGuessSchema.extend({
    isGameCompleted: z.literal(false)
});


export const ResponseGuessSchema = z.union([
    ResponseCompleteGameSchema,
    ResponseInProgressSchema,
]);





export type IResponseGuess = z.infer<typeof ResponseGuessSchema>;