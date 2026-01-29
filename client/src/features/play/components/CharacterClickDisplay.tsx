import React from 'react';
import styles from './CharacterClickDisplay.module.css';
import { ICharacter } from '../models/IPlayContextHandle';
import { IClickCharacterDisplay } from '../models/IClickCharacterDisplay';

type ICharacterClickDisplayProps = {
    characters: ICharacter[],
    clickX: number,
    clickY: number,
    setIsGuessLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setAvailableCharacters: React.Dispatch<React.SetStateAction<ICharacter[]>>
    setIsOpenAvailableCharactersMenu: React.Dispatch<React.SetStateAction<IClickCharacterDisplay>>
}

export function CharacterClickDisplay({
    characters,
    clickX,
    clickY,
    setIsGuessLoading,
    setAvailableCharacters,
    setIsOpenAvailableCharactersMenu
}: ICharacterClickDisplayProps) {
    const onClick = async (character: ICharacter) => {
        console.log(`Character ${character.name} clicked at coordinates (${clickX}, ${clickY})`);
        setIsGuessLoading(true);
        setIsOpenAvailableCharactersMenu({ isOpen: false });

    }


    return (
        <div className={styles.characterClickDisplay} style={
            {
                top: clickY,
                left: clickX
            }
        }>
            {characters.map((character, indx) => (

                <React.Fragment key={character.name + indx}>

                    <div onClick={async () => {
                        await onClick(character);
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
