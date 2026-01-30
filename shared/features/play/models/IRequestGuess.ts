import z from "zod";
import { NumberFromStringSchema } from "../../util/models/INumber";


export const RequestGuessSchema = z.object({
    gameSessionId: z.string({ message: "Game session ID is required as a string" }).min(1, { message: "Game session ID cannot be empty" }),
    gameName: z.string({ message: "Game name is required as a string" }).min(1, { message: "Game name cannot be empty" }),
    characterName: z.string({ message: "Character name is required as a string" }).min(1, { message: "Character name cannot be empty" }),
    xCoordinate: NumberFromStringSchema,
    yCoordinate: NumberFromStringSchema,

});


export type IRequestGuess = z.infer<typeof RequestGuessSchema>;