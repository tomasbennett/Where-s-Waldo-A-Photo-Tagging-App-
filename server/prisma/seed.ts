import { Prisma, PrismaClient } from '@prisma/client';

// import "dotenv/config";
import dotenv from "dotenv";
import { GameToCharactersNameMap, IAllGameID } from '../../shared/features/play/models/ISharedDefaultGameDetails';
import { INewBackendCharacterDataMap } from './models/INewBackendCharacterStructure';
dotenv.config({
    path: "../.env"
});
// import bcrypt from "bcrypt";


const prisma = new PrismaClient();





const newBackendCharacterDataMap: INewBackendCharacterDataMap = {
    "fantasy": {
        "Cartographer": {
            xCoordinate: 771,
            yCoordinate: 514,
            width: 72,
            height: 74
        },
        "Knight": {
            xCoordinate: 343,
            yCoordinate: 962,
            width: 77,
            height: 249
        },
        "Wizard": {
            xCoordinate: 115,
            yCoordinate: 112,
            width: 91,
            height: 208
        }
    },
    "sci-fi": {
        "Hologram": {
            xCoordinate: 527,
            yCoordinate: 602,
            width: 55,
            height: 128
        },
        "Hooded Cyborg": {
            xCoordinate: 885,
            yCoordinate: 1371,
            width: 114,
            height: 154
        },
        "Ski Goggles Human": {
            xCoordinate: 336,
            yCoordinate: 1394,
            width: 67,
            height: 131
        }
    },
    "super-heroes": {
        "Not Batwoman": {
            xCoordinate: 852,
            yCoordinate: 25,
            width: 74,
            height: 101
        },
        "Not Scarecrow": {
            xCoordinate: 653,
            yCoordinate: 455,
            width: 55,
            height: 76
        },
        "Not Wonderwoman": {
            xCoordinate: 858,
            yCoordinate: 612,
            width: 93,
            height: 343
        }
    }
};




async function buildDefaultValues(): Promise<Prisma.GameCreateInput[]> {
    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;

    // const defaultAdminUser: Prisma.UserCreateInput = {
    //     username: 'admin',
    //     password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "default_admin_password", saltRounds),
    //     blogs: {
    //         createMany: {
    //             data: [
    //                 {
    //                     title: "JavaScript Blog Tutorial",
    //                     body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
    //                 },
    //                 {
    //                     title: "TypeScript Learning together",
    //                     body: "This is a course in typescript that teaches users the importance of type safety when coding bigger projects like this one Lorem ipsum dolor sit amet consectetur adipisicing elit Sapiente odit blanditiis enim sit cupiditate asperiores minima veritatis delectus nisi praesentium accusamus ab quasi Commodi eveniet quo culpa corporis repellat accusamus magni quos Atque facilis voluptas obcaecati ad harum asperiores reprehenderit explicabo tempore cupiditate magnam consequatur odit soluta voluptates quasi Earum"
    //                 },
    //                 {
    //                     title: "React, a js framework",
    //                     body: "This is a react framework course that also uses tsx for type safety. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
    //                 },
    //                 {
    //                     title: "Express backend framework for Nodejs",
    //                     body: "Want a backend framework that is literally only good for making apis, try express. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
    //                 },
    //                 {
    //                     title: "Making friends",
    //                     body: "I won't be able to assist but I heard somewhere that touching grass is a good first step, best of luck to you on your journey. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
    //                 }
    //             ]
    //         }
    //     }
    // };




    const defaultGames: Prisma.GameCreateInput[] = Object.entries(newBackendCharacterDataMap).map(([gameKey, charactersMap]) => ({
        name: gameKey,
        characters: {
            createMany: {
                data: Object.entries(charactersMap).map(([charName, charData]) => ({
                    name: charName,
                    xCoordinate: charData.xCoordinate,
                    yCoordinate: charData.yCoordinate,
                    width: charData.width,
                    height: charData.height
                }))
            }
        }
    }));

    return defaultGames;
}



async function insertDefaultValues() {
    const defaultUsers = await buildDefaultValues();

    for (const userData of defaultUsers) {
        await prisma.game.create({
            data: userData
        });
    }
}



async function main() {
    try {
        console.log('Seeding database with default values...');
        await insertDefaultValues();
        console.log('Database seeding completed.');

    } catch (error) {
        console.error('Error seeding database:', error);

    } finally {
        await prisma.$disconnect();

    }
}

main();
