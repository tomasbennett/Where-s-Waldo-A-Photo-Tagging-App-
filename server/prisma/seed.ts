import { Prisma, PrismaClient } from '@prisma/client';

// import "dotenv/config";
import dotenv from "dotenv";
import { GameToCharactersNameMap, IAllGameID } from '../../shared/features/play/models/ISharedDefaultGameDetails';
dotenv.config({
    path: "../.env"
});
// import bcrypt from "bcrypt";


const prisma = new PrismaClient();


type INewBackendCharacterData = {
    xCoordinate: number
    yCoordinate: number
    width: number
    height: number
}

type INewBackendCharacterDataMap = {
    [K in IAllGameID]: {
        [C in GameToCharactersNameMap[K]]: INewBackendCharacterData
    }
}


const newBackendCharacterDataMap: INewBackendCharacterDataMap = {
    "fantasy": {
        "Cartographer": {
            xCoordinate: 100,
            yCoordinate: 150,
            width: 64,
            height: 64
        },
        "Knight": {
            xCoordinate: 200,
            yCoordinate: 150,
            width: 64,
            height: 64
        },
        "Wizard": {
            xCoordinate: 300,
            yCoordinate: 150,
            width: 64,
            height: 64
        }
    },
    "sci-fi": {
        "Hologram": {
            xCoordinate: 120,
            yCoordinate: 180,
            width: 70,
            height: 70
        },
        "Hooded Cyborg": {
            xCoordinate: 220,
            yCoordinate: 180,
            width: 70,
            height: 70
        },
        "Ski Goggles Human": {
            xCoordinate: 320,
            yCoordinate: 180,
            width: 70,
            height: 70
        }
    },
    "super-heroes": {
        "Not Batwoman": {
            xCoordinate: 130,
            yCoordinate: 200,
            width: 80,
            height: 80
        },
        "Not Scarecrow": {
            xCoordinate: 230,
            yCoordinate: 200,
            width: 80,
            height: 80
        },
        "Not Wonderwoman": {
            xCoordinate: 330,
            yCoordinate: 200,
            width: 80,
            height: 80
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

    const defaultFantasyGame: Prisma.GameCreateInput = {
        name: 'fantasy',
        characters: {
            createMany: {
                data: [

                ]
            }
        }
    }


    const defaultGames: Prisma.GameCreateInput[] = [
        defaultFantasyGame
    ];

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
