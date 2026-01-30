import { useLocation } from "react-router-dom";
import styles from "./Timer.module.css";

import { useEffect, useState, useRef } from "react";





export function Timer() {

    const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
    const intervalRef = useRef<number | null>(null); // <- number, not NodeJS.Timer

    const start = () => {
        if (intervalRef.current !== null) return; // already running
        intervalRef.current = window.setInterval(() => {
            setSecondsElapsed(prev => prev + 1);
        }, 1000);
    };

    const stop = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current); // works perfectly now
            intervalRef.current = null;
        }
    };

    const reset = () => {
        stop();
        setSecondsElapsed(0);
    };

    const location = useLocation();



    useEffect(() => {
        reset()
        start();
        console.log("LOCATION: " + location.pathname);
        return () => stop();
    }, [location.pathname]);


    const hours = Math.floor(secondsElapsed / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;




    return (
        <div className={styles.timerContainer}>
            <span className={styles.timer}>{formattedTime}</span>
        </div>
    );
}