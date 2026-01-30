import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./PlayLayout.module.css";
import { Navigate, Outlet, useMatches, useNavigate } from "react-router-dom";
import { ICharacter, IPlayContextHandle, PlayContextHandleSchema } from "../models/IPlayContextHandle";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { Timer } from "../components/Timer";
import { CharacterHeaderDisplay } from "../components/CharacterHeaderDisplay";
import { CharacterClickDisplay } from "../components/CharacterClickDisplay";
import { IClickCharacterDisplay } from "../models/IClickCharacterDisplay";


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



    useEffect(() => {
        //START GAME SESSION HERE

        return () => {
            //END GAME SESSION IF THERE EXISTS ONE
        };
    }, []);



    return (

        <>

            <Outlet />

            <div data-img-ratio={mainImgRatio} ref={mainOverflowContainerRef} className={styles.playLayoutContainer}>

                <div data-img-ratio={mainImgRatio} ref={headerContainerRef} className={styles.headerSpace}>

                    <div className={styles.headerMoving}>

                        <Timer />


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




            </div>

        </>
    )
}