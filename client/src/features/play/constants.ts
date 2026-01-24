import { IPlayContextHandle } from "../../models/IPlayContextHandle";

import fantasyImg from "../../assets/images/fantasy/fantasy.png";
import sciFiImg from "../../assets/images/sci-fi/scifi.png";


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
            name: "Space Marine",
            imgUrl: "https://example.com/images/space_marine.png"
        },
        {
            name: "Alien Scientist",
            imgUrl: "https://example.com/images/alien_scientist.png"
        },
        {
            name: "Robot Engineer",
            imgUrl: "https://example.com/images/robot_engineer.png"
        }
    ],
    backendRoute: "sci-fi"
}