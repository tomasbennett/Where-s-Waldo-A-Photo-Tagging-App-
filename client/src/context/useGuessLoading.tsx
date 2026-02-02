import { createContext, useEffect, useState } from "react";
import React from "react";
import { domain } from "../constants/EnvironmentAPI";
import { APISuccessSchema } from "../../../shared/features/api/models/APISuccessResponse";



type ISetGuessLoadingContext = {
    isGuessLoading: boolean;
    setGuessLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GuessLoadingContext = createContext<ISetGuessLoadingContext | null>(null);



export const useGuessLoading = () => {
    const context = React.useContext(GuessLoadingContext);
    if (!context) {
        throw new Error("useGuessLoading must be used within an GuessLoadingProvider");
    }
    return context;
}



export function GuessLoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const ctx: ISetGuessLoadingContext = {
        isGuessLoading: isLoading,
        setGuessLoading: setIsLoading
    }



    return (
        <GuessLoadingContext.Provider value={ctx}>
            {children}
        </GuessLoadingContext.Provider>
    );
}