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

    return prisma;
  };
}

export const makePrismaClient = makePrismaClientFactory();
