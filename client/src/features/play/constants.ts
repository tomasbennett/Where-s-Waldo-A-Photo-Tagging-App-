import { IPlayContextHandle } from "../../models/IPlayContextHandle";

import fantasyImg from "../../assets/images/fantasy/fantasy.png";
import sciFiImg from "../../assets/images/sci-fi/scifi.png";
import superHeroImg from "../../assets/images/superheroes/superheroes.png";

import hoodedCyborgImg from "../../assets/images/sci-fi/scifi-characters/hooded-cyborg.png";
import hologramImg from "../../assets/images/sci-fi/scifi-characters/hologram.png";
import skiGogglesHumanImg from "../../assets/images/sci-fi/scifi-characters/ski-goggles.png";

import cartographerImg from "../../assets/images/fantasy/fantasy-characters/cartogripher.png";
import knightImg from "../../assets/images/fantasy/fantasy-characters/Knight.png";
import wizardImg from "../../assets/images/fantasy/fantasy-characters/wizard.png";

import notBatwomanImg from "../../assets/images/superheroes/superhero-characters/not-batwoman.png";
import notWonderwomanImg from "../../assets/images/superheroes/superhero-characters/not-wonderwoman.png";
import notScarecrowImg from "../../assets/images/superheroes/superhero-characters/not-scarecrow.png";



export const fantasyPlayContextHandle: IPlayContextHandle = {
    imgUrl: fantasyImg,
    characters: [
        {
            name: "Cartographer",
            imgUrl: cartographerImg
        },
        {
            name: "Knight",
            imgUrl: knightImg
        },
        {
            name: "Wizard",
            imgUrl: wizardImg
        }
    ],
    backendRoute: "fantasy"
}


export const sciFiPlayContextHandle: IPlayContextHandle = {
    imgUrl: sciFiImg,
    characters: [
        {
            name: "Hooded Cyborg",
            imgUrl: hoodedCyborgImg
        },
        {
            name: "Hologram",
            imgUrl: hologramImg
        },
        {
            name: "Ski Goggles Human",
            imgUrl: skiGogglesHumanImg
        }
    ],
    backendRoute: "sci-fi"
}


export const superHeroPlayContextHandle: IPlayContextHandle = {
    imgUrl: superHeroImg,
    characters: [
        {
            name: "Not Batwoman",
            imgUrl: notBatwomanImg
        },
        {
            name: "Not Wonderwoman",
            imgUrl: notWonderwomanImg
        },
        {
            name: "Not Scarecrow",
            imgUrl: notScarecrowImg
        },
    ],
    backendRoute: "super-heroes"
}


export const minAspectRatio: number = 0.8;
export const maxAspectRatio: number = 1.3;