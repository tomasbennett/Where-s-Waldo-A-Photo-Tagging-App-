import { useEffect, useMemo, useState } from "react";
import { useMatches, Navigate } from "react-router-dom";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { IPlayContextHandle, PlayContextHandleSchema } from "../../play/models/IPlayContextHandle";
import styles from "./LeaderBoardLayout.module.css";
import { ILeaderBoardEntriesArray } from "../../../../../shared/features/leaderBoard/models/IGetLeaderBoardResponse";
import React from "react";
import { TimeFormatter } from "../../../services/TimeFormatter";



export function LeaderBoardLayout() {

    const matches = useMatches();

    if (matches?.length <= 0) {
        const error: IHomePageErrors = {
            errorMessage: "Invalid route matches array!!!"
        };

        return <Navigate to="/home" replace state={error} />;
    }

    const playHandle: IPlayContextHandle | null = useMemo(() => {

        for (const match of matches) {
            const parsed = PlayContextHandleSchema.safeParse(match.handle);
            if (parsed.success) {
                return parsed.data;
            }
        }

        return null;

    }, [matches]);


    if (!playHandle) {
        const error: IHomePageErrors = {
            errorMessage: "No valid play context found in route matches!!!"
        };

        return <Navigate to="/home" replace state={error} />;
    }


    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [leaderBoardArr, setLeaderBoardArr] = useState<ILeaderBoardEntriesArray>([
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello",
            timeInMilliseconds: 11300
        },
        {
            username: "Hello1111111111111111111111111111111111111111111111",
            timeInMilliseconds: 11300
        },
    ]);



    useEffect(() => {
        try {
            setIsLoading(true);


        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }, []);



    return (
        <>

            <div className={styles.outerContainer}>

                <div className={styles.imgContainer}>
                    <img src={playHandle.imgUrl} alt={`Game main image: ${playHandle.gameName}`} />
                </div>

                <div className={styles.leaderBoardContainer}>

                    <div className={styles.leaderBoardHeader}>
                        <p className={styles.headerPos}>
                            Pos
                        </p>
                        <p className={styles.headerTime}>
                            Time
                        </p>
                        <p className={styles.headerUsername}>
                            Username
                        </p>
                    </div>

                    {
                        leaderBoardArr.map((entry, indx) => {
                            const pos = indx + 1;

                            const ms = entry.timeInMilliseconds;

                            const hours = Math.floor(ms / (1000 * 60 * 60));
                            const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((ms % (1000 * 60)) / 1000);


                            return (
                                <React.Fragment key={entry.username + indx}>
                                    <div className={styles.leaderBoardEntry}>
                                        
                                        <p className={styles.entryPos}>
                                            {
                                                `${pos}.`
                                            }
                                        </p>
                                        <p className={styles.entryTime}>
                                            {TimeFormatter(hours, minutes, seconds)}
                                        </p>
                                        <p className={styles.entryUsername}>
                                            {entry.username}
                                        </p>

                                    </div>
                                </React.Fragment>
                            )
                        })
                    }




                </div>



            </div>


        </>
    )
}