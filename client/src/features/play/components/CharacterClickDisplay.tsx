import React from 'react';
import styles from './CharacterClickDisplay.module.css';

type ICharacterClickDisplayProps = {
    characters: {
        name: string;
        img: string;
    }[]
}

export function CharacterClickDisplay({
    characters
}: ICharacterClickDisplayProps) {
    return (
        <div className={styles.characterClickDisplay}>
            {characters.map((character, indx) => (

                <React.Fragment key={character.name + indx}>

                    <div className={styles.imgContainer}>
                        <img src={character.img} alt={`Character Image: ${character.name}`} />
                    </div>
                    <p>{character.name}</p>

                </React.Fragment>

            ))}
        </div>
    );
}
