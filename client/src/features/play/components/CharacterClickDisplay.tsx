import React from 'react';
import styles from './CharacterClickDisplay.module.css';
import { ICharacter } from '../models/IPlayContextHandle';
import { IClickCharacterDisplay } from '../models/IClickCharacterDisplay';

type ICharacterClickDisplayProps = {
    characters: ICharacter[],
    clickX: number,
    clickY: number,
    // setIsGuessLoading: React.Dispatch<React.SetStateAction<boolean>>,
    // setAvailableCharacters: React.Dispatch<React.SetStateAction<ICharacter[]>>
    // setIsOpenAvailableCharactersMenu: React.Dispatch<React.SetStateAction<IClickCharacterDisplay>>
    // isOpenAvailableCharactersMenu: IClickCharacterDisplay,
    characterGuess: (character: ICharacter, xCoordinate: number, yCoordinate: number) => Promise<void>
}

export function CharacterClickDisplay({
    characters,
    clickX,
    clickY,
    // isOpenAvailableCharactersMenu,
    characterGuess

}: ICharacterClickDisplayProps) {
    // const display = isOpenAvailableCharactersMenu.isOpen ? "flex" : "none"


    return (
        <div className={styles.characterClickDisplay} style={
            {
                top: clickY,
                left: clickX,
                // display: display
            }
        }>
            {characters.map((character, indx) => (

                <React.Fragment key={character.name + indx}>

                    <div onClick={async () => {
                        await characterGuess(character, clickX, clickY);
                    }} className={styles.characterContainer}>

                        <div className={styles.imgContainer}>
                            <img src={character.imgUrl} alt={`Character Image: ${character.name}`} />
                        </div>
                        <p>{character.name}</p>

                    </div>

                </React.Fragment>

            ))}
        </div>
    );
}
