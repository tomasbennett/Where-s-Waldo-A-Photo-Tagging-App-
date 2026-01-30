import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PlayLayout.module.css";
import { Navigate, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { ICharacter, IPlayContextHandle, PlayContextHandleSchema } from "../models/IPlayContextHandle";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { Timer } from "../components/Timer";
import { CharacterHeaderDisplay } from "../components/CharacterHeaderDisplay";
import { CharacterClickDisplay } from "../components/CharacterClickDisplay";
import { IClickCharacterDisplay } from "../models/IClickCharacterDisplay";
import { IStartGameResponse, StartGameResponseSchema } from "../../../../../shared/features/play/models/IStartGameResponse";
import { LoadingCircle } from "../../../components/LoadingCircle";
import { domain } from "../../../constants/EnvironmentAPI";
import { APIErrorSchema, ICustomErrorResponse } from "../../../../../shared/features/api/models/APIErrorResponse";
import { notExpectedFormatError } from "../../../constants/constants";
import { IRequestGuess } from "../../../../../shared/features/play/models/IRequestGuess";
import { ResponseGuessSchema } from "../../../../../shared/features/play/models/IResponseGuess";
import { error } from "console";



export function PlayLayout() {

    const mainImgRef = useRef<HTMLImageElement | null>(null);
    const headerContainerRef = useRef<HTMLDivElement | null>(null);
    const mainOverflowContainerRef = useRef<HTMLDivElement | null>(null);

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



    useEffect(() => {
        if (playHandle) {
            console.log("Play Context Handle:", playHandle);
        }
    }, [playHandle]);



    const [mainImgRatio, setMainImgRatio] = useState<"wide" | "tall" | null>(null);


    const calculateLayout = () => {
        if (!mainImgRef.current || !headerContainerRef.current || !mainOverflowContainerRef.current) {
            console.log("One or more refs are null, cannot calculate layout!!!");
            return;
        }

        const headerContainerRect =
            headerContainerRef.current.getBoundingClientRect();

        const mainOverflowContainerRect =
            mainOverflowContainerRef.current.getBoundingClientRect();

        const availableHeight = mainOverflowContainerRect.height - headerContainerRect.height;
        const availableWidth = mainOverflowContainerRect.width - 40;

        const availableAspectRatio =
            availableWidth / availableHeight;


        const imgNaturalWidth = mainImgRef.current.naturalWidth;
        const imgNaturalHeight = mainImgRef.current.naturalHeight;
        const imgAspectRatio = imgNaturalWidth / imgNaturalHeight;

        console.log(`Container available height: ${availableAspectRatio}`);
        console.log(`Img Aspect Ratio: ${imgAspectRatio}`);

        //WE HAVE TO FIGURE THIS OUT


        if (imgAspectRatio > 1) {
            // WIDE IMAGE
            setMainImgRatio("wide");

        } else {
            // TALL IMAGE
            setMainImgRatio("tall");


        }



    };



    // const observer = useRef<ResizeObserver | null>(null);


    // const addResizeObserver = () => {
    //     observer.current = new ResizeObserver(calculateLayout);
    //     if (mainOverflowContainerRef.current) {
    //         observer.current.observe(mainOverflowContainerRef.current);
    //     }

    // }

    // useEffect(() => {

    //     return () => {
    //         if (observer.current) {
    //             observer.current.disconnect()
    //         }
    //     };
    // }, []);

    const [isGuessLoading, setIsGuessLoading] = useState<boolean>(false);
    const [charactersAvailable, setCharactersAvailable] = useState<ICharacter[]>(
        () => playHandle.characters.map(char => ({ ...char }))
    );

    const [isOpenCharacterClickDisplay, setIsOpenCharacterClickDisplay] = useState<IClickCharacterDisplay>({ isOpen: false });



    const onClickImg = (e: React.MouseEvent<HTMLImageElement>) => {
        console.log("Main image clicked!!!");

        const mainImg = mainImgRef.current;
        if (!mainImg) {
            console.log("Main image ref is null, cannot get click coordinates!!!");
            return;
        }


        const rect = mainImg.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const scaleX = mainImg.naturalWidth / rect.width;
        const scaleY = mainImg.naturalHeight / rect.height;

        const clickXPixels = Math.floor(clickX * scaleX);
        const clickYPixels = Math.floor(clickY * scaleY);

        console.log(`Click coordinates: (X: ${clickXPixels}, Y: ${clickYPixels})`);


        setIsOpenCharacterClickDisplay({
            isOpen: true,
            xCoordinate: clickXPixels,
            yCoordinate: clickYPixels
        });

    }


    const [gameSession, setGameSession] = useState<string | null>(null);
    const [isGameSessionLoading, setIsGameSessionLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        //START GAME SESSION HERE

        async function getGameSession() {
            try {
                setIsGameSessionLoading(true);
                setGameSession(null);

                const response = await fetch(`${domain}/api/start/${playHandle!.gameName}`, {
                    method: "POST"
                });

                const jsonData = await response.json();

                const gameSessionResult = StartGameResponseSchema.safeParse(jsonData);
                if (gameSessionResult.success) {
                    console.log(gameSessionResult.data.gameSessionId);
                    setGameSession(gameSessionResult.data.gameSessionId);
                    return;
                }

                const errorResult = APIErrorSchema.safeParse(jsonData);
                if (errorResult.success) {
                    navigate("/home", {
                        state: {
                            error: errorResult.data
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
                setIsGameSessionLoading(false);

            }

        }

        getGameSession();



        return () => {
            //END GAME SESSION IF THERE EXISTS ONE

            async function deleteGameSession() {
                try {
                    if (!gameSession) {
                        return;
                    }

                    setIsGameSessionLoading(true);

                    const deleteGameSessionResponse = await fetch(`${domain}/api/game/${gameSession}`, {
                        method: "DELETE"
                    });

                    if (deleteGameSessionResponse.status === 204) {
                        setGameSession(null);
                        return;
                    }

                    const jsonData = await deleteGameSessionResponse.json();

                    const errorResult = APIErrorSchema.safeParse(jsonData);
                    if (errorResult.success) {
                        console.error(errorResult.data);
                    }

                    console.error(
                        notExpectedFormatError
                    );



                } catch (error) {
                    if (error instanceof Error) {
                        const errorMessage: ICustomErrorResponse = {
                            ok: false,
                            status: 0,
                            message: error.message
                        }

                        console.error(errorMessage);

                        return;
                    }

                    console.error({
                        ok: false,
                        status: 0,
                        message: "Unexpected error occurred!!!"
                    });

                    return;

                } finally {
                    setIsGameSessionLoading(false);

                }

            }

            deleteGameSession();


        };
    }, [location.pathname]);

    const characterGuess = async (character: ICharacter, xCoordinate: number, yCoordinate: number) => {
        try {
            if (!gameSession) {
                return;
            }

            setIsGuessLoading(true);
            setIsOpenCharacterClickDisplay({ isOpen: false });

            const guess: IRequestGuess = {
                gameSessionId: gameSession,
                gameName: playHandle.gameName,
                characterName: character.name,
                xCoordinate,
                yCoordinate

            }

            const guessCharacterResponse = await fetch(`${domain}/api/guess`, {
                method: "POST",
                body: JSON.stringify(guess)
            });

            const jsonData = await guessCharacterResponse.json();

            const guessResponseResult = ResponseGuessSchema.safeParse(jsonData);
            if (guessResponseResult.success) {
                const guessRes = guessResponseResult.data;

                if (guessRes.isGameCompleted) {
                    //RESET CHARACTERS
                    //NAVIGATE TO LEADERBOARD PAGE
                    //WILL TURNING THE GAME SESSION TO NULL WORK HERE???
                    //NOTE: WHEN THE GAME IS OVER NAVIGATING OFF THE PAGE WILL DELETE THE GAME SESSION NOT WHAT WE WANT
                    //NEVERMIND WE CAN TURN IT TO NULL HERE AND OPEN THE DIALOG
                    //WE HAVE TO KEEP GAME SESSION ID UNTIL SUBMITTING FORM
                    //PROBABLY NEED A NEW WAY OF DELETING GAME SESSION IF THE GAME IS COMPLETED AND LEFT KEEP GAMESESSION

                }

                if (guessRes.isCorrect) {
                    //REMOVE CHARACTER FROM AVAILABLE CHARACTERS


                }

                if (!guessRes.isCorrect) {

                }

            }

            const errorResult = APIErrorSchema.safeParse(jsonData);
            if (errorResult.success) {
                navigate("/home", {
                    state: {
                        error: errorResult.data
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
            setIsGuessLoading(false);

        }
    }


    return (

        <>

            <Outlet />

            <div data-img-ratio={mainImgRatio} ref={mainOverflowContainerRef} className={styles.playLayoutContainer}>

                {
                    isGameSessionLoading ?
                        <div className={styles.loadingContainer}>

                            <LoadingCircle height="6rem" />

                        </div>

                        :

                        <>
                        
                            <div data-img-ratio={mainImgRatio} ref={headerContainerRef} className={styles.headerSpace}>


                                        <div className={styles.headerMoving}>

                                            <Timer key={location.pathname} />


                                            <CharacterHeaderDisplay characters={charactersAvailable} />


                                        </div>




                            </div>

                            <div data-img-ratio={mainImgRatio} className={styles.mainImageContainer}>


                                <img onClick={onClickImg} data-img-ratio={mainImgRatio} onLoad={() => {
                                    calculateLayout();
                                    // addResizeObserver();
                                }} ref={mainImgRef} src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />



                                {
                                    isOpenCharacterClickDisplay.isOpen &&
                                    <CharacterClickDisplay
                                        clickX={isOpenCharacterClickDisplay.xCoordinate}
                                        clickY={isOpenCharacterClickDisplay.yCoordinate}
                                        characters={charactersAvailable}
                                        setIsGuessLoading={setIsGuessLoading}
                                        setAvailableCharacters={setCharactersAvailable}
                                        setIsOpenAvailableCharactersMenu={setIsOpenCharacterClickDisplay}
                                    />

                                }


                            </div>
                        
                        </>

                }

            </div>

        </>
    )
}