import { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./HomePageLayout.module.css";
import { APIErrorSchema, ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";


export function HomePageLayout() {


    const location = useLocation();
    const stateERRORS = location.state?.error as ICustomErrorResponse | undefined;






    useEffect(() => {
        if (stateERRORS) {
            window.history.replaceState({}, document.title);
        }

    }, []);

    useEffect(() => {
        console.log(stateERRORS);
    }, []);

    return (
        <>

            <p>HOME PAGE</p>



        </>
    )
}