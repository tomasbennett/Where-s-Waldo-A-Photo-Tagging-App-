import React from "react";
import styles from "./CharacterHeaderDisplay.module.css";
import { ICharacter } from "../models/IPlayContextHandle";
import { useMediaQuery } from "react-responsive";
import { mediumScreenMaxWidth, thinScreenMaxWidth } from "../../../constants/constants";


type ICharacterHeaderDisplayProps = {
    characters: ICharacter[]
}

export function CharacterHeaderDisplay({
    characters
}: ICharacterHeaderDisplayProps) {

    const isMediumWidthScreen = useMediaQuery({ maxWidth: mediumScreenMaxWidth });
    const isThinWidthScreen = useMediaQuery({ maxWidth: thinScreenMaxWidth });






    return (

        <div className={styles.outerContainer}>

            <div className={styles.characterHeader}>

                {characters.map((character, indx) => (

                    <React.Fragment key={character.name + indx}>

                        <div className={`${styles.characterContainer} ${character.isFound && styles.alreadySelectedCharacter}`}>

                            <div className={styles.imgContainer}>
                                <img src={character.imgUrl} alt={`Character Image: ${character.name}`} />
                            </div>


                            {
                                !isThinWidthScreen &&
                                <p className={styles.name}>{character.name}</p>
                            }


                        </div>

                    </React.Fragment>

                ))}

            </div>
        </div>
    );
}