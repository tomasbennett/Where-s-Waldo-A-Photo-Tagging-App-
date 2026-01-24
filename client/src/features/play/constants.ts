import { IPlayContextHandle } from "../../models/IPlayContextHandle";

import fantasyImg from "../../assets/images/fantasy/fantasy.png";
import sciFiImg from "../../assets/images/sci-fi/scifi.png";
import superHeroImg from "../../assets/images/superheroes/superheroes.png";

import hoodedCyborgImg from "../../assets/images/sci-fi/scifi-characters/hooded-cyborg.png";
import hologramImg from "../../assets/images/sci-fi/scifi-characters/hologram.png";
import skiGogglesHumanImg from "../../assets/images/sci-fi/scifi-characters/ski-goggles.png";




export const fantasyPlayContextHandle: IPlayContextHandle = {
    imgUrl: fantasyImg,
    characters: [
        {
            name: "Elf Warrior",
            imgUrl: "https://example.com/images/elf_warrior.png"
        },
        {
            name: "Dwarf Miner",
            imgUrl: "https://example.com/images/dwarf_miner.png"
        },
        {
            name: "Human Mage",
            imgUrl: "https://example.com/images/human_mage.png"
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


// export const superHeroPlayContextHandle: IPlayContextHandle = {
//     imgUrl: superHeroImg,
//     characters: [
//         {

//         },
//         {

//         },
//         {

//         },
//     ],
//     backendRoute: "super-heroes"
// }


export const minAspectRatio: number = 0.8;
export const maxAspectRatio: number = 1.3;