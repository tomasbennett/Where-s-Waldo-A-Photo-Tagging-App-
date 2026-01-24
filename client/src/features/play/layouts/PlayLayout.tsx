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
    const mainImgContainerRef = useRef<HTMLDivElement | null>(null);
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

    };

    useEffect(() => {
        const observer = new ResizeObserver(calculateLayout);
        if (mainOverflowContainerRef.current) {
            observer.observe(mainOverflowContainerRef.current);
        }

        return () => observer.disconnect();
    }, []);




    return (

        <>

            <Outlet />

            <div ref={mainOverflowContainerRef} className={styles.playLayoutContainer}>

                <div className={styles.headerSpace}>

                    <div className={styles.headerMoving}>

                        <Timer />


                        <CharacterHeaderDisplay characters={playHandle.characters} />


                    </div>

                </div>

                <div ref={mainImgContainerRef} className={styles.mainImageContainer}>

                    <img ref={mainImgRef} src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />

                    <CharacterClickDisplay characters={playHandle.characters} />

                </div>




            </div>

        </>
    )
}