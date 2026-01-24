import React from "react";
import styles from "./CharacterHeaderDisplay.module.css";


type ICharacterHeaderDisplayProps = {
    characters: {
        name: string;
        img: string;
    }[]
}

export function CharacterHeaderDisplay({
    characters
}: ICharacterHeaderDisplayProps) {
    return (
        <div className={styles.characterHeader}>

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