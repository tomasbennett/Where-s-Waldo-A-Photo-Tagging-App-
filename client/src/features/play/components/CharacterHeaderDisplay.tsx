import React from "react";
import styles from "./CharacterHeaderDisplay.module.css";
import { ICharacter } from "../../../models/IPlayContextHandle";


type ICharacterHeaderDisplayProps = {
    characters: ICharacter[]
}

export function CharacterHeaderDisplay({
    characters
}: ICharacterHeaderDisplayProps) {
    return (
        <div className={styles.characterHeader}>

            {characters.map((character, indx) => (

                <React.Fragment key={character.name + indx}>

                    <div className={styles.characterContainer}>

                        <div className={styles.imgContainer}>
                            <img src={character.imgUrl} alt={`Character Image: ${character.name}`} />
                        </div>
                        <p className={styles.name}>{character.name}</p>

                    </div>
                
                </React.Fragment>

            ))}
            
        </div>
    );
}