import { IPlayContextHandle } from "./models/IPlayContextHandle";

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
import { allGamesSharedDetails, fantasySharedGameDetails, sciFiSharedGameDetails, superHeroSharedGameDetails } from "../../../../shared/features/play/constants";
import { GameToCharactersMap, GameToCharactersNameMap, IAllGameID } from "../../../../shared/features/play/models/ISharedDefaultGameDetails";
import { INewGameFrontendData, INewCharacterFrontendData, IAllGamesExtraFrontendData } from "./models/INewFrontendDataTypes";





// export const fantasyPlayContextHandle: IPlayContextHandle = {
//     imgUrl: fantasyImg,
//     characters: [
//         {
//             name: "Cartographer",
//             imgUrl: cartographerImg
//         },
//         {
//             name: "Knight",
//             imgUrl: knightImg
//         },
//         {
//             name: "Wizard",
//             imgUrl: wizardImg
//         }
//     ],
//     backendRoute: fantasySharedGameDetails.backendRoute,
//     gameName: fantasySharedGameDetails.gameName
// }



// export const sciFiPlayContextHandle: IPlayContextHandle = {
//     imgUrl: sciFiImg,
//     characters: [
//         {
//             name: "Hooded Cyborg",
//             imgUrl: hoodedCyborgImg
//         },
//         {
//             name: "Hologram",
//             imgUrl: hologramImg
//         },
//         {
//             name: "Ski Goggles Human",
//             imgUrl: skiGogglesHumanImg
//         }
//     ],
//     backendRoute: sciFiSharedGameDetails.backendRoute,
//     gameName: sciFiSharedGameDetails.gameName
// }


// export const superHeroPlayContextHandle: IPlayContextHandle = {
//     imgUrl: superHeroImg,
//     characters: [
//         {
//             name: "Not Batwoman",
//             imgUrl: notBatwomanImg
//         },
//         {
//             name: "Not Wonderwoman",
//             imgUrl: notWonderwomanImg
//         },
//         {
//             name: "Not Scarecrow",
//             imgUrl: notScarecrowImg
//         },
//     ],
//     backendRoute: superHeroSharedGameDetails.backendRoute,
//     gameName: superHeroSharedGameDetails.gameName
// }








const allGamesExtraFrontendData = {
    "fantasy": {
        imgUrl: fantasyImg,
        characters: {
            "Cartographer": { imgUrl: cartographerImg },
            "Knight": { imgUrl: knightImg },
            "Wizard": { imgUrl: wizardImg }
        }
    },
    "sci-fi": {
        imgUrl: sciFiImg,
        characters: {
            "Hooded Cyborg": { imgUrl: hoodedCyborgImg },
            "Hologram": { imgUrl: hologramImg },
            "Ski Goggles Human": { imgUrl: skiGogglesHumanImg }
        }
    },
    "super-heroes": {
        imgUrl: superHeroImg,
        characters: {
            "Not Batwoman": { imgUrl: notBatwomanImg },
            "Not Wonderwoman": { imgUrl: notWonderwomanImg },
            "Not Scarecrow": { imgUrl: notScarecrowImg }
        }
    }
} as const satisfies IAllGamesExtraFrontendData;







// export const allPlayContextHandles: IPlayContextHandle[] = allGamesSharedDetails.map(game => {
//     const frontend = allGamesExtraFrontendData[game.gameName];

//     return {
//         ...game,
//         imgUrl: frontend.imgUrl,
//         characters: game.characters.map((char) => {
//             return ({
//                 ...char,
//                 imgUrl: frontend.characters[char.name].imgUrl

//             })
//     })
//     }
// });




const enrichedCharactersByGame = {
    fantasy: fantasySharedGameDetails.characters.map(char => ({
        ...char,
        imgUrl: allGamesExtraFrontendData.fantasy.characters[char.name].imgUrl,
    })),
    "sci-fi": sciFiSharedGameDetails.characters.map(char => ({
        ...char,
        imgUrl: allGamesExtraFrontendData["sci-fi"].characters[char.name].imgUrl,
    })),
    "super-heroes": superHeroSharedGameDetails.characters.map(char => ({
        ...char,
        imgUrl: allGamesExtraFrontendData["super-heroes"].characters[char.name].imgUrl,
    })),
} satisfies {
        [K in IAllGameID]: Array<GameToCharactersMap[K] & INewCharacterFrontendData>;
    };



const allPlayContextHandles = allGamesSharedDetails.map(game => ({
    ...game,
    imgUrl: allGamesExtraFrontendData[game.gameName].imgUrl,
    characters: enrichedCharactersByGame[game.gameName],
}));
