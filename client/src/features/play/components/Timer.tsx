import styles from "./Timer.module.css";


export function Timer() {
    return (
        <div className={styles.timer}>
            <span>00:45:00</span>
        </div>
    );
}