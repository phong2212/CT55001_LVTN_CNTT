import { PrismaClient } from "@prisma/client";
import prismaRandom from 'prisma-extension-random';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    //@ts-ignore
    if (!global.prisma) {
        //@ts-ignore
        global.prisma = new PrismaClient();
    }
    //@ts-ignore
    prisma = global.prisma
}

export default prisma.$extends(prismaRandom());
