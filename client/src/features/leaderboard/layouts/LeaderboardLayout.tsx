import { useEffect, useMemo, useRef, useState } from "react";
import { useMatches, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { IPlayContextHandle, PlayContextHandleSchema } from "../../play/models/IPlayContextHandle";
import styles from "./LeaderBoardLayout.module.css";
import { GetLeaderBoardEntriesResponseSchema, ILeaderBoardEntriesArray } from "../../../../../shared/features/leaderBoard/models/IGetLeaderBoardResponse";
import React from "react";
import { TimeFormatter } from "../../../services/TimeFormatter";
import { HomeIcon } from "../../../assets/icons/HomeIcon";
import { Link } from "react-router-dom";
import { HoursMinutesSecondsFromMs } from "../../../services/HoursMinutesSecondsFromMs";
import { domain } from "../../../constants/EnvironmentAPI";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { GetLeaderBoardQueryParamsSchema, IGetLeaderBoardQueryParams } from "../../../../../shared/features/leaderBoard/models/IGetLeaderBoardQueryParams";
import { toQueryString } from "../../../services/ToQueryString";
import { notExpectedFormatError } from "../../../constants/constants";
import { LoadingCircle } from "../../../components/LoadingCircle";



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
    const [leaderBoardArr, setLeaderBoardArr] = useState<ILeaderBoardEntriesArray>([]);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const fullParams: IGetLeaderBoardQueryParams = useMemo(() => {
        const defaults: IGetLeaderBoardQueryParams = {
            gameId: playHandle.gameName,
            limit: 10,
            offset: 0
        };

        const parsedQuery = {
            limit: searchParams.get("limit")
                ? Number(searchParams.get("limit"))
                : undefined,
            offset: searchParams.get("offset")
                ? Number(searchParams.get("offset"))
                : undefined
        };


        const result = GetLeaderBoardQueryParamsSchema
            .partial()
            .safeParse(parsedQuery);

        if (!result.success) {
            return defaults;
        }

        return {
            ...defaults,
            ...result.data
        };
    }, [searchParams, playHandle.gameName]);

    const [loadMoreState, setLoadMoreState] = useState<"loading" | "Load More" | "No More Available">("loading");

    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {

        async function getLeaderboardEntries() {
            try {
                abortController.current?.abort();
                abortController.current = new AbortController();

                setIsLoading(true);
                const urlParams: string = toQueryString(fullParams);
                const url: string = `${domain}/api/leaderboard?${urlParams}`;

                console.log(`THE URL COOL IS: ${url}`);
                const response = await fetch(url, {
                    method: "GET",
                    signal: abortController.current.signal
                });

                const jsonData = await response.json();

                const leaderBoardEntriesResult = GetLeaderBoardEntriesResponseSchema.safeParse(jsonData);
                if (leaderBoardEntriesResult.success) {
                    console.log("THIS Leader board clg defines success!!!");
                    setLoadMoreState(leaderBoardEntriesResult.data.leaderBoardEntries.length < fullParams.limit ? "No More Available" : "Load More");
                    setLeaderBoardArr(leaderBoardEntriesResult.data.leaderBoardEntries);
                    return;
                }

                console.log("A NON successful response");


                const customErrorResult = APIErrorSchema.safeParse(jsonData);
                if (customErrorResult.success) {
                    navigate("/home", {
                        state: {
                            error: customErrorResult.data
                        }
                    });

                    return;
                }

                navigate("/home", {
                    state: {
                        error: notExpectedFormatError
                    }
                });

                return;


            } catch (error) {



                if (error instanceof Error) {

                    if (error.name === "AbortError") {
                        console.error("ABORTERROR has run for some reason!!!");
                        return;
                    };

                    const errorMessage: ICustomErrorResponse = {
                        ok: false,
                        status: 0,
                        message: error.message
                    }

                    navigate("/home", {
                        state: {
                            error: errorMessage
                        }
                    });

                    return;
                }

                navigate("/home", {
                    state: {
                        error: {
                            ok: false,
                            status: 0,
                            message: "Unexpected error occurred!!!"
                        }
                    }
                });

                return;

            } finally {
                setIsLoading(false);
            }

        }

        getLeaderboardEntries();

        return () => {
            abortController.current?.abort();
        }

    }, [searchParams]);




    const onLoadTenMore = async () => {
        const startingOffset: number = leaderBoardArr.length + fullParams.offset;
        const limit: number = 10;

        const tenMoreLeaderboardEntriesQueryParams: IGetLeaderBoardQueryParams = {
            gameId: playHandle.gameName,
            limit,
            offset: startingOffset
        }

        try {
            abortController.current?.abort()
            abortController.current = new AbortController();

            setLoadMoreState("loading");
            const urlParams: string = toQueryString(tenMoreLeaderboardEntriesQueryParams);
            const url: string = `${domain}/api/leaderboard?${urlParams}`;

            console.log(`THE URL LOAD MORE IS: ${url}`);
            const response = await fetch(url, {
                method: "GET",
                signal: abortController.current.signal
            });

            const jsonData = await response.json();

            const leaderBoardEntriesResult = GetLeaderBoardEntriesResponseSchema.safeParse(jsonData);
            if (leaderBoardEntriesResult.success) {
                setLoadMoreState(leaderBoardEntriesResult.data.leaderBoardEntries.length < limit ? "No More Available" : "Load More");
                setLeaderBoardArr(prev => [...prev, ...leaderBoardEntriesResult.data.leaderBoardEntries]);
                return;
            }


            const customErrorResult = APIErrorSchema.safeParse(jsonData);
            if (customErrorResult.success) {
                navigate("/home", {
                    state: {
                        error: customErrorResult.data
                    }
                });

                return;
            }

            navigate("/home", {
                state: {
                    error: notExpectedFormatError
                }
            });

            return;

        } catch (error) {
            if (error instanceof Error) {
                if (error.name === "AbortError") return;

                const errorMessage: ICustomErrorResponse = {
                    ok: false,
                    status: 0,
                    message: error.message
                }

                navigate("/home", {
                    state: {
                        error: errorMessage
                    }
                });

                return;
            }

            navigate("/home", {
                state: {
                    error: {
                        ok: false,
                        status: 0,
                        message: "Unexpected error occurred!!!"
                    }
                }
            });

            return;
        }


    }


    return (
        <>

            <div className={styles.outerContainer} data-loading={`${isLoading}`}>
                {
                    isLoading ?
                        <LoadingCircle height="7rem" />

                        :

                        <>

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
                                        const pos = indx + 1 + fullParams.offset;

                                        const ms = entry.timeInMilliseconds;

                                        const { hours, minutes, seconds } = HoursMinutesSecondsFromMs(ms);

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

                            <div className={styles.loadMoreContainer}>
                                <button onClick={() => {
                                    if (loadMoreState === "No More Available" || loadMoreState === "loading") {
                                        return;
                                    }
                                    onLoadTenMore();
                                }} type="button">{
                                        loadMoreState === "loading" ?
                                            <LoadingCircle height="90%" />

                                            :

                                            loadMoreState

                                    }</button>
                            </div>

                            <Link to={`/home`} className={styles.homeBtnContainer}>
                                <HomeIcon />
                            </Link>
                        </>


                }




            </div>


        </>
    )
}