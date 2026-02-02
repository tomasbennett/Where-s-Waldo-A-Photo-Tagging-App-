import { useState } from "react";
import { ICurrGuesses } from "../models/ICurrGuesses";

export function useGuesses() {
    const [currGuesses, setCurrGuesses] = useState<ICurrGuesses[]>([]);

    
    
}