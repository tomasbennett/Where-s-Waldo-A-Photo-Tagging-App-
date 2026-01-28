import z from "zod";
import { numCharactersRequiredForPlay } from "../constants";




export const CharacterSharedSchema = z.object({
    name: z.string(
        { message: "Character name is required as a string" }
    ).min(1, 
        { message: "Character name must be at least 1 character long" }
    )
});


export type ICharacterShared = z.infer<typeof CharacterSharedSchema>;









export const SharedPlayDetailsSchema = z.object({
    gameName: z.string({ message: "Game name is required" }).min(1, { message: "Game name must be at least 1 character long" }),
    characters: z.array(CharacterSharedSchema, { message: "All elements of the array must be a character" }).length(numCharactersRequiredForPlay, { 
        message: "Number of character(s) required per game is: " + numCharactersRequiredForPlay 
    }),
    backendRoute: z.string({
        message: "Backend route is required as a string!!!"
    })
});



export type ISharedPlayDetails = z.infer<typeof SharedPlayDetailsSchema>;