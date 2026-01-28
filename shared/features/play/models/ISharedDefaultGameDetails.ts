import { allGamesSharedDetails } from "../constants";

export type IAllGameID = typeof allGamesSharedDetails[number]["gameName"];



export type GameToCharactersMap = {
    [G in typeof allGamesSharedDetails[number]as G["gameName"]]:
    G["characters"][number];
};




export type GameToCharactersNameMap = {
    [G in typeof allGamesSharedDetails[number]as G["gameName"]]:
    G["characters"][number]["name"];
};

//THESE SAY APPLY ME TO A TYPE NOT AN OBJECT AND THEN INPUT THE NAME OF A GAME IN allGamesSharedDetails TO GET THE TYPE OF CHARACTERS/CHARACTERS NAMES FOR THAT GAME
