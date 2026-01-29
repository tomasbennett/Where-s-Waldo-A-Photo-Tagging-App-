import z from "zod";
import { numCharactersRequiredForPlay } from "../../../../../shared/features/play/constants";
import { CharacterSharedSchema, SharedPlayDetailsSchema } from "../../../../../shared/features/play/models/ISharedCharacterDetails";

export const CharacterSchema = CharacterSharedSchema.extend({
    imgUrl: z.string(
        { message: "Character image URL is required as a string!!!" }
    ),
    isFound: z.boolean({ message: "Character isFound status is required as a boolean!!!" })
});


export type ICharacter = z.infer<typeof CharacterSchema>;





export const PlayContextHandleSchema = SharedPlayDetailsSchema.omit({ characters: true }).extend({
    imgUrl: z.string({
        message: "Image URL is required as a string!!!"
    }),
    characters: z.array(CharacterSchema, {
        message: "Characters must be an array of character objects!!!"
    }).length(numCharactersRequiredForPlay, {
        message: `There must be exactly ${numCharactersRequiredForPlay} character(s) provided!!!`
    })
});


export type IPlayContextHandle = z.infer<typeof PlayContextHandleSchema>;