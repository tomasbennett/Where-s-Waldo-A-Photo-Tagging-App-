import { IAllGameID, GameToCharactersNameMap } from "../../../../../shared/features/play/models/ISharedDefaultGameDetails";

export type INewGameFrontendData = {
    imgUrl: string;
}

export type INewCharacterFrontendData = {
    imgUrl: string;
}


export type IAllGamesExtraFrontendData = {
    [K in IAllGameID]: INewGameFrontendData & {
        characters: {
            [C in GameToCharactersNameMap[K]]: INewCharacterFrontendData;
        }
    }
}