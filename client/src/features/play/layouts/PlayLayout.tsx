import { useEffect, useMemo } from "react";
import styles from "./PlayLayout.module.css";
import { Navigate, Outlet, useMatches, useNavigate } from "react-router-dom";
import { IPlayContextHandle, PlayContextHandleSchema } from "../../../models/IPlayContextHandle";
import { IHomePageErrors } from "../../../models/IHomePageErrors";
import { Timer } from "../components/Timer";
import { CharacterHeaderDisplay } from "../components/CharacterHeaderDisplay";
import { usePlayHandle } from "../hooks/usePlayHandle";
import { CharacterClickDisplay } from "../components/CharacterClickDisplay";


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


    return (

        <>

            <Outlet />

            <div className={styles.playLayoutContainer}>
                <div className={styles.headerSpace}>

                    <div className={styles.headerMoving}>

                        <Timer />

                        {
                            playHandle.characters.map((character, index) => (
                                <CharacterHeaderDisplay
                                    key={character.name + index}
                                    name={character.name}
                                    img={character.imgUrl} />
                            ))
                        }

                    </div>

                </div>

                <div className={styles.mainImageContainer}>

                    <img src={playHandle.imgUrl} alt={`Main Image: ${playHandle.backendRoute}`} />

                    <CharacterClickDisplay />

                </div>


            </div>

        </>
    )
}