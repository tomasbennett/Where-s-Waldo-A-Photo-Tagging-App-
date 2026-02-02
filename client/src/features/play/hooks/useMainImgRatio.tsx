import { useRef, useState, useEffect, RefObject } from "react";

type IUseMainImgRatioProps = {
    mainImgRef: RefObject<HTMLImageElement | null>;
    mainOverflowContainerRef: RefObject<HTMLDivElement | null>
}

export function useMainImgRatio({
    mainImgRef,
    mainOverflowContainerRef
}: IUseMainImgRatioProps) {
    


    const [mainImgRatio, setMainImgRatio] = useState<"wide" | "tall" | null>(null);


    const calculateLayout = () => {
        if (!mainImgRef.current || !mainOverflowContainerRef.current) {
            console.log("One or more refs are null, cannot calculate layout!!!");
            return;
        }

        const fullContainerWidth = mainOverflowContainerRef.current.offsetWidth;
        const fullContainerHeight = mainOverflowContainerRef.current.offsetHeight;
        const fullContainerAspectRatio = fullContainerWidth / fullContainerHeight;


        const imgNaturalWidth = mainImgRef.current.naturalWidth;
        const imgNaturalHeight = mainImgRef.current.naturalHeight;
        const imgAspectRatio = imgNaturalWidth / imgNaturalHeight;

        console.log(`The full container width should be: ${fullContainerWidth}`);
        console.log(`The full container height should be: ${fullContainerHeight}`);

        console.log(`Is the container aspect ratio greater than img aspect ratio should be no space if true::: ${fullContainerAspectRatio > imgAspectRatio}`);


        //WE HAVE TO FIGURE THIS OUT


        if (imgAspectRatio > fullContainerAspectRatio) {
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