import { useEffect, useMemo, useRef, useState } from "react";
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



    const [mainImgRatio, setMainImgRatio] = useState<"wide" | "tall" | null>(null);


    const calculateLayout = () => {
        if (!mainImgRef.current || !headerContainerRef.current || !mainOverflowContainerRef.current) {
            console.log("One or more refs are null, cannot calculate layout!!!");
            return;
        }


        const imgNaturalWidth = mainImgRef.current.naturalWidth;
        const imgNaturalHeight = mainImgRef.current.naturalHeight;


        if (imgNaturalWidth / imgNaturalHeight > 1) {
            // WIDE IMAGE
            setMainImgRatio("wide");
            // mainImgRef.current.style.height = `100%`;
            // mainImgRef.current.style.width = `auto`;
        } else {
            // TALL IMAGE
            setMainImgRatio("tall");
            // mainImgRef.current.style.width = `100%`;
            // mainImgRef.current.style.height = `auto`;

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

            <div data-img-ratio={mainImgRatio} ref={mainOverflowContainerRef} className={styles.playLayoutContainer}>

                <div data-img-ratio={mainImgRatio} ref={headerContainerRef} className={styles.headerSpace}>

                    <div className={styles.headerMoving}>

                        <Timer />


                        <CharacterHeaderDisplay characters={playHandle.characters} />


                    </div>

                </div>

                <div data-img-ratio={mainImgRatio} className={styles.mainImageContainer}>

                    <img data-img-ratio={mainImgRatio} onLoad={() => {
                        calculateLayout();
                        // addResizeObserver();
                    }} ref={mainImgRef} src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />

                    <CharacterClickDisplay characters={playHandle.characters} />

                </div>




            </div>

        </>
    )
}