import React from 'react';
import styles from './CharacterClickDisplay.module.css';
import { ICharacter } from '../models/IPlayContextHandle';

type ICharacterClickDisplayProps = {
    characters: ICharacter[]
}

export function CharacterClickDisplay({
    characters
}: ICharacterClickDisplayProps) {
    return (
        <div className={styles.characterClickDisplay}>
            {characters.map((character, indx) => (

                <React.Fragment key={character.name + indx}>

                    <div className={styles.characterContainer}>

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
