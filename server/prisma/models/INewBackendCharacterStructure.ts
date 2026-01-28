import { IAllGameID, GameToCharactersNameMap } from "../../../shared/features/play/models/ISharedDefaultGameDetails"

export type INewBackendCharacterData = {
    xCoordinate: number
    yCoordinate: number
    width: number
    height: number
}

export type INewBackendCharacterDataMap = {
    [K in IAllGameID]: {
        [C in GameToCharactersNameMap[K]]: INewBackendCharacterData
    }
}