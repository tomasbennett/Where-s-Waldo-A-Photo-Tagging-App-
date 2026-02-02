import { Outlet } from "react-router-dom";
import styles from "./GeneralHomeLayout.module.css";
import { useGuessLoading } from "../context/useGuessLoading";



export function GeneralHomeLayout() {
  const {
    isGuessLoading
  } = useGuessLoading();

  return (
    <div className={`${isGuessLoading && styles.loadingContainer} ${styles.backgroundContainer}`}>
        <Outlet />
    </div>
  );
}   