import { IClickDisplayBothDirections } from "./IClickDisplayBoxDirections";

export type IClickCharacterDisplay = {
    isOpen: boolean;
    xCoordinate: number;
    yCoordinate: number;
    visualXCoord: number;
    visualYCoord: number;
} & IClickDisplayBothDirections