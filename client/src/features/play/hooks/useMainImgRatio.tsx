import { useRef, useState, useEffect, RefObject } from "react";
import { IImgNaturalSize } from "../models/IImgNaturalSize";

type IUseMainImgRatioProps = {
    mainImgRef: RefObject<HTMLImageElement | null>;
    mainOverflowContainerRef: RefObject<HTMLDivElement | null>,
    imgScaleContainerRef: RefObject<HTMLDivElement | null>,
    imgNaturalSizeRef: RefObject<IImgNaturalSize | null>
}

export function useMainImgRatio({
    mainImgRef,
    mainOverflowContainerRef,
    imgScaleContainerRef,
    imgNaturalSizeRef
}: IUseMainImgRatioProps) {
    


    const [mainImgRatio, setMainImgRatio] = useState<"wide" | "tall" | null>(null);
    
    const calculateLayout = () => {
        if (
            !mainImgRef.current || 
            !mainOverflowContainerRef.current || 
            !imgScaleContainerRef.current || 
            !imgNaturalSizeRef.current
        ) {
            console.log("One or more refs are null, cannot calculate layout!!!");
            return;
        }
        
        const fullContainerWidth = mainOverflowContainerRef.current.offsetWidth;
        const fullContainerHeight = mainOverflowContainerRef.current.offsetHeight;
        const fullContainerAspectRatio = fullContainerWidth / fullContainerHeight;
        


        console.log(`The full container width should be: ${fullContainerWidth}`);
        console.log(`The full container height should be: ${fullContainerHeight}`);

        console.log(`Is the container aspect ratio greater than img aspect ratio should be no space if true::: ${fullContainerAspectRatio > imgNaturalSizeRef.current.naturalAspectRatio}`);


        //WE HAVE TO FIGURE THIS OUT
        

        if (imgNaturalSizeRef.current.naturalAspectRatio > fullContainerAspectRatio) {
            // WIDE IMAGE
            setMainImgRatio("wide");

        } else {
            // TALL IMAGE
            setMainImgRatio("tall");


        }



    };



    const observer = useRef<ResizeObserver | null>(null);


    const addResizeObserver = () => {
        observer.current = new ResizeObserver(calculateLayout);
        if (mainOverflowContainerRef.current) {
            observer.current.observe(mainOverflowContainerRef.current);
        }

    }

    useEffect(() => {

        return () => {
            if (observer.current) {
                observer.current.disconnect()
            }
        };
    }, []);


    return {
        mainImgRef,
        mainOverflowContainerRef,
        calculateLayout,
        addResizeObserver,
        mainImgRatio
    }
}