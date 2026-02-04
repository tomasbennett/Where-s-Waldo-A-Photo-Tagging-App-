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
import { mediumScreenMaxWidth, notExpectedFormatError, thinScreenMaxWidth } from "../../../constants/constants";
import { IRequestGuess } from "../../../../../shared/features/play/models/IRequestGuess";
import { ResponseGuessSchema } from "../../../../../shared/features/play/models/IResponseGuess";
import { error } from "console";
import { useMediaQuery } from "react-responsive";
import { useMainImgRatio } from "../hooks/useMainImgRatio";
import { useGuessLoading } from "../../../context/useGuessLoading";
import { ICurrGuesses } from "../models/ICurrGuesses";
import { CheckMark } from "../../../assets/icons/CheckMark";
import { XIcon } from "../../../assets/icons/XIcon";
import { Guess } from "../components/Guess";
import { FinishedForm } from "../components/FinishedForm";
import { IAllGameID } from "../../../../../shared/features/play/models/ISharedDefaultGameDetails";
import { IImgNaturalSize } from "../models/IImgNaturalSize";



export function PlayLayout() {


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



    const mainImgRef = useRef<HTMLImageElement | null>(null);
    const mainOverflowContainerRef = useRef<HTMLDivElement | null>(null);

    const {
        setGuessLoading: setIsGuessLoading
    } = useGuessLoading();


    const imgScaleContainerRef = useRef<HTMLDivElement | null>(null);

    const imgNaturalSizeRef = useRef<IImgNaturalSize | null>(null);

    const {
        mainImgRatio,
        calculateLayout,
        addResizeObserver,
    } = useMainImgRatio({
        mainImgRef,
        mainOverflowContainerRef,
        imgScaleContainerRef,
        imgNaturalSizeRef
    });
















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



        const x =
            clickX / rect.width;

        const y =
            clickY / rect.height;




        setIsOpenCharacterClickDisplay({
            isOpen: true,
            xCoordinate: clickXPixels,
            yCoordinate: clickYPixels,
            visualXCoord: x,
            visualYCoord: y
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
                        return;
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



    const [currGuesses, setCurrGuesses] = useState<ICurrGuesses[]>([]);
    const [timeInMs, setTimeInMs] = useState<number | null>(null);

    const intervalRef = useRef<number | null>(null);


    const characterGuess = async (character: ICharacter, xCoordinate: number, yCoordinate: number, visualX: number, visualY: number) => {
        try {
            if (!gameSession) {
                return;
            }

            const guessedCharacter = character;

            setIsGuessLoading(true);
            setIsOpenCharacterClickDisplay({ isOpen: false });

            const guess: IRequestGuess = {
                gameSessionId: gameSession,
                gameName: playHandle.gameName,
                characterName: guessedCharacter.name,
                xCoordinate,
                yCoordinate

            }

            const guessCharacterResponse = await fetch(`${domain}/api/guess`, {
                method: "POST",
                body: JSON.stringify(guess),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const jsonData = await guessCharacterResponse.json();

            const guessResponseResult = ResponseGuessSchema.safeParse(jsonData);
            if (guessResponseResult.success) {
                const guessRes = guessResponseResult.data;

                if (guessRes.isCorrect) {
                    //REMOVE CHARACTER FROM AVAILABLE CHARACTERS
                    console.log("CHARACTER SELECTED IS CORRECT");
                    setCharactersAvailable(prev => {
                        return prev.map((char) => {


                            return {
                                ...char,
                                isFound: char.name === guessedCharacter.name ? true : char.isFound
                            }
                        })
                    });

                    //MARK CORRECTLY ON THE PAGE
                    setCurrGuesses(prev => [...prev, {
                        guess: "correct",
                        xCoord: visualX,
                        yCoord: visualY
                    }]);
                }

                if (guessRes.isGameCompleted) {
                    //RESET CHARACTERS
                    //NAVIGATE TO LEADERBOARD PAGE
                    //WILL TURNING THE GAME SESSION TO NULL WORK HERE???
                    //NOTE: WHEN THE GAME IS OVER NAVIGATING OFF THE PAGE WILL DELETE THE GAME SESSION NOT WHAT WE WANT
                    //NEVERMIND WE CAN TURN IT TO NULL HERE AND OPEN THE DIALOG
                    //WE HAVE TO KEEP GAME SESSION ID UNTIL SUBMITTING FORM
                    //PROBABLY NEED A NEW WAY OF DELETING GAME SESSION IF THE GAME IS COMPLETED AND LEFT KEEP GAMESESSION
                    console.log("Game is completed");
                    setTimeInMs(guessRes.timeToCompleteGameMs);
                    if (intervalRef.current !== null) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }

                    return;

                }


                if (!guessRes.isCorrect) {
                    console.log("CHARACTER SELECTED IS NOT CORRECT");
                    setCurrGuesses(prev => [...prev, {
                        guess: "incorrect",
                        xCoord: visualX,
                        yCoord: visualY
                    }]);
                    return;

                }

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
            setIsGuessLoading(false);

        }
    }

    const isMediumScreen = useMediaQuery({ maxWidth: mediumScreenMaxWidth });

    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

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

                            <div data-img-ratio={mainImgRatio} className={`${styles.headerSpace} ${styles.mediumWidthHeaderSpace}`}>


                                <div className={styles.headerMoving}>
                                    {
                                        !isMediumScreen &&
                                        <div className={styles.headerLeftContainer}>
                                        </div>

                                    }



                                    <Timer setSecondsElapsed={setSecondsElapsed} secondsElapsed={secondsElapsed} intervalRef={intervalRef} key={location.pathname} />


                                    <CharacterHeaderDisplay characters={charactersAvailable} />


                                </div>




                            </div>

                            <div ref={mainOverflowContainerRef} data-img-ratio={mainImgRatio} className={styles.mainImageContainer}>

                                <div data-img-ratio={mainImgRatio} ref={imgScaleContainerRef} className={styles.imgScaleContainer}>

                                    <img onClick={onClickImg} onLoad={() => {
                                        const img = mainImgRef.current;
                                        const imgScaleContainer = imgScaleContainerRef.current;
                                        if (!img || !imgScaleContainer) {
                                            console.error("IMG or imgContainer failed to load to get natural aspect ratio!!!");
                                            return;
                                        }

                                        const imgNaturalAspectRatio = img.naturalWidth / img.naturalHeight;

                                        imgNaturalSizeRef.current = {
                                            naturalWidth: img.naturalWidth,
                                            naturalHeight: img.naturalHeight,
                                            naturalAspectRatio: imgNaturalAspectRatio
                                        }

                                        imgScaleContainer.style.aspectRatio = imgNaturalSizeRef.current.naturalAspectRatio.toString();


                                        calculateLayout();
                                        addResizeObserver();
                                    }} ref={mainImgRef} src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />



                                    {
                                        isOpenCharacterClickDisplay.isOpen &&
                                        <CharacterClickDisplay
                                            clickX={isOpenCharacterClickDisplay.xCoordinate}
                                            clickY={isOpenCharacterClickDisplay.yCoordinate}
                                            visualX={isOpenCharacterClickDisplay.visualXCoord}
                                            visualY={isOpenCharacterClickDisplay.visualYCoord}
                                            characters={charactersAvailable}

                                            characterGuess={characterGuess}


                                        />

                                    }

                                    <Guess currGuesses={currGuesses} />

                                </div>

                            </div>



                        </>

                }

            </div>

            <FinishedForm
                setSecondsElapsed={setSecondsElapsed}
                gameName={playHandle.gameName as IAllGameID}
                gameSessionId={gameSession ?? ""}
                timeInMs={timeInMs}
            />

        </>
    )
}