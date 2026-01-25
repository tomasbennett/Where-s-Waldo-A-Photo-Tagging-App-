import { useEffect, useMemo, useRef } from "react";
import styles from "./PlayLayout.module.css";
import { Navigate, Outlet, useMatches, useNavigate } from "react-router-dom";
import { IPlayContextHandle, PlayContextHandleSchema } from "../../../models/IPlayContextHandle";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { Timer } from "../components/Timer";
import { CharacterHeaderDisplay } from "../components/CharacterHeaderDisplay";
import { usePlayHandle } from "../hooks/usePlayHandle";
import { CharacterClickDisplay } from "../components/CharacterClickDisplay";


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


    const calculateLayout = () => {
        if (!mainImgRef.current || !headerContainerRef.current || !mainOverflowContainerRef.current) {
            console.log("One or more refs are null, cannot calculate layout!!!");
            return;
        }


        const imgNaturalWidth = mainImgRef.current.naturalWidth;
        const imgNaturalHeight = mainImgRef.current.naturalHeight;

        // const headerHeight = headerContainerRef.current.getBoundingClientRect().height;

        // const mainRect = mainOverflowContainerRef.current.getBoundingClientRect();
        // const containerWidth = mainRect.width;
        // const availableHeight = mainRect.height - headerHeight;

        // const widthRatio = containerWidth / availableHeight;

        //I'M BEING SILLY HERE AND NO MATTER WHAT THE ASPECT RATIO OF THE IMAGE IS WE GROW ONLY HEIGHT OR WIDTH BASED ON WHAT THE ASPECT RATIO IS MAKING SURE THAT HEIGHT IS 100% OF THE CONTAINER AND WIDTH IS AUTO IF THE ASPECT RATIO > 1


        if (imgNaturalWidth / imgNaturalHeight > 1) {
            // WIDE IMAGE
            mainImgRef.current.style.height = `100%`;
            mainImgRef.current.style.width = `auto`;
        } else {
            // TALL IMAGE
            mainImgRef.current.style.width = `100%`;
            mainImgRef.current.style.height = `auto`;

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




    return (

        <>

            <Outlet />

            <div ref={mainOverflowContainerRef} className={styles.playLayoutContainer}>

                <div ref={headerContainerRef} className={styles.headerSpace}>

                    <div className={styles.headerMoving}>

                        <Timer />


                        <CharacterHeaderDisplay characters={playHandle.characters} />


                    </div>

                </div>

                <div className={styles.mainImageContainer}>

                    <img onLoad={() => {
                        calculateLayout();
                        // addResizeObserver();
                    }} ref={mainImgRef} src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />

                    <CharacterClickDisplay characters={playHandle.characters} />

                </div>




            </div>

        </>
    )
}