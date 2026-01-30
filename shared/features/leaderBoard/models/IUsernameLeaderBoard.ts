import z from "zod";
import { minUsernameLength, maxUsernameLength, usernameRegex } from "../constants";


export const UsernameLeaderBoardSchema = z
    .string({ message: "Username must be of type string!!!" })
    .min(minUsernameLength, { message: `Username should have a min length of ${minUsernameLength}` })
    .max(maxUsernameLength, { message: `Username should have a max length of ${maxUsernameLength}` })
    .regex(usernameRegex, { message: "This username contains invalid characters!!!" })



export type IUsernameLeaderBoard = z.infer<typeof UsernameLeaderBoardSchema>;