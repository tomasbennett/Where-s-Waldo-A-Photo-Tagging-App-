import React, { RefObject, useRef } from 'react';
import styles from './CharacterClickDisplay.module.css';
import { ICharacter } from '../models/IPlayContextHandle';
import { IClickCharacterDisplay } from '../models/IClickCharacterDisplay';

type ICharacterClickDisplayProps = {
    characters: ICharacter[],
    clickX: number,
    clickY: number,
    visualX: number,
    visualY: number
    characterGuess: (character: ICharacter, xCoordinate: number, yCoordinate: number, visualX: number, visualY: number) => Promise<void>

}

export function CharacterClickDisplay({
    characters,
    clickX,
    clickY,
    visualX,
    visualY,

    characterGuess,


}: ICharacterClickDisplayProps) {




    return (
        <div className={styles.characterClickDisplay} style={
            {
                top: visualY,
                left: visualX,
                // display: display
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
