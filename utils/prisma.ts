import {PrismaClient} from '@prisma/client';

/*
 * Global constant.
 */

declare global {
  var prisma: PrismaClient | undefined;
}

/*
 * Client.
 */

function makePrismaClientFactory() {
  return (): PrismaClient => {
    const prisma = global.prisma ?? new PrismaClient();

    if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

    return prisma;
  };
}

export const makePrismaClient = makePrismaClientFactory();
