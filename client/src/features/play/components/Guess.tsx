import { CheckMark } from "../../../assets/icons/CheckMark";
import { XIcon } from "../../../assets/icons/XIcon";
import { ICurrGuesses } from "../models/ICurrGuesses";
import styles from "./Guess.module.css";

type IGuessProps = {
    currGuesses: ICurrGuesses[]
}

export function Guess({
    currGuesses
}: IGuessProps) {

    return (
        <>
            {
                currGuesses.map((guess, indx) => {
                    return (
                        <div style={
                            {
                                top: `${guess.yCoord * 100}%`,
                                left: `${guess.xCoord * 100}%`
                            }
                        } key={guess.guess + guess.xCoord + guess.yCoord + indx} className={`${guess.guess === "correct" && styles.correctGuessContainer} ${styles.guessContainer}`}>
                            {
                                guess.guess === "correct" ?
                                    <CheckMark />

                                    :

                                    <XIcon />
                            }
                        </div>
                    )
                })
            }
        </>
    )
}