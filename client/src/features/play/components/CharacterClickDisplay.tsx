import React, { RefObject, useRef } from 'react';
import styles from './CharacterClickDisplay.module.css';
import { ICharacter } from '../models/IPlayContextHandle';
import { IClickCharacterDisplay } from '../models/IClickCharacterDisplay';
import { IClickDisplayBoxDirections } from '../models/IClickDisplayBoxDirections';

type ICharacterClickDisplayProps = {
    isOpen: boolean,
    characters: ICharacter[],
    clickX: number,
    clickY: number,
    visualX: number,
    visualY: number,
    characterGuess: (character: ICharacter, xCoordinate: number, yCoordinate: number, visualX: number, visualY: number) => Promise<void>,

    clickDisplayBox: RefObject<HTMLDivElement | null>,

    xTransformDirection: IClickDisplayBoxDirections,
    yTransformDirection: IClickDisplayBoxDirections
}

export function CharacterClickDisplay({
    isOpen,
    characters,
    clickX,
    clickY,
    visualX,
    visualY,

    characterGuess,

    clickDisplayBox,

    xTransformDirection,
    yTransformDirection
}: ICharacterClickDisplayProps) {




    return (
        <div data-open={isOpen} ref={clickDisplayBox} className={styles.characterClickDisplay} style={
            {
                top: `${visualY * 100}%`,
                left: `${visualX * 100}%`,
                transform: `translate(${xTransformDirection}, ${yTransformDirection})`
            }
        }>
            {characters.map((character, indx) => {

                if (character.isFound) {
                    return null;
                }

                return (
                    <React.Fragment key={character.name + indx}>

                        <div onClick={async () => {
                            await characterGuess(character, clickX, clickY, visualX, visualY);
                        }} className={styles.characterContainer}>

                            <div className={styles.imgContainer}>
                                <img src={character.imgUrl} alt={`Character Image: ${character.name}`} />
                            </div>
                            <p>{character.name}</p>

                        </div>

                    </React.Fragment>

                )

            })}
        </div>
    );
}
