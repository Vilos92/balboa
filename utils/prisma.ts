import {PrismaClient} from '@prisma/client';

/*
 * Client.
 */

function makePrismaClientFactory() {
  let prisma: PrismaClient | undefined;

  return (): PrismaClient => {
    if (prisma) return prisma;

    prisma = new PrismaClient();
    return prisma;
  };
}

export const makePrismaClient = makePrismaClientFactory();
