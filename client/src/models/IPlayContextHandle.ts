import z from "zod";



export const PlayContextHandleSchema = z.object({
    imgUrl: z.string({
        message: "Image URL is required as a string!!!"
    }),
    characters: z.array(z.object({
        name: z.string(
            { message: "Character name is required as a string!!!" }
        ),
        imgUrl: z.string(
            { message: "Character image URL is required as a string!!!" }
        )
    }), {
        message: "Characters must be an array of character objects!!!"
    }).length(3, {
        message: "There must be exactly 3 characters provided!!!"
    }),
    backendRoute: z.string({
        message: "Backend route is required as a string!!!"
    })
});






export type IPlayContextHandle = z.infer<typeof PlayContextHandleSchema>;