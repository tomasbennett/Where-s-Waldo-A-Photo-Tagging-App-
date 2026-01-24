import styles from "./Timer.module.css";


export function Timer() {
    return (
        <div className={styles.timerContainer}>
            <span className={styles.timer}>00:45:00</span>
        </div>
    );
}