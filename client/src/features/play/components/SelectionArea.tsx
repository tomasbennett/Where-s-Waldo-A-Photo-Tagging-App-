import { SelectionAreaIcon } from "../../../assets/icons/SelectionAreaIcon";
import styles from "./SelectionArea.module.css";


export function SelectionArea() {
    return (
        <div className={styles.selectionAreaContainer}>
            <SelectionAreaIcon />
        </div>
    );
}