import { ISharedPlayDetails } from "./models/ISharedCharacterDetails";

export const numCharactersRequiredForPlay: number = 3;


export const fantasySharedGameDetails = {
    backendRoute: "fantasy",
    gameName: "fantasy",
    characters: [
        { name: "Cartographer" },
        { name: "Knight" },
        { name: "Wizard" }
    ]
} as const satisfies ISharedPlayDetails;




export const sciFiSharedGameDetails = {
    backendRoute: "sci-fi",
    gameName: "sci-fi",
    characters: [
        { name: "Hooded Cyborg" },
        { name: "Hologram" },
        { name: "Ski Goggles Human" }
    ]
} as const satisfies ISharedPlayDetails;


export const superHeroSharedGameDetails = {
    backendRoute: "super-heroes",
    gameName: "super-heroes",
    characters: [
        { name: "Not Batwoman" },
        { name: "Not Wonderwoman" },
        { name: "Not Scarecrow" }
    ]   
} as const satisfies ISharedPlayDetails;



export const allGamesSharedDetails = [
    fantasySharedGameDetails,
    sciFiSharedGameDetails,
    superHeroSharedGameDetails
] as const satisfies ISharedPlayDetails[];


