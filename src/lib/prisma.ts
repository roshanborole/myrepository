import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const client = new PrismaClient();
  return client.$extends({
    query: {
      match: {
        async create({ args, query }) {
          if (args.data.status === 'LIVE') {
            const liveMatch = await client.match.findFirst({
              where: { status: 'LIVE' }
            });
            if (liveMatch) {
              throw new Error('Another match is already LIVE at RoshSpark Cricket Stadium. Cannot create a new LIVE match.');
            }
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data.status === 'LIVE') {
            const liveMatch = await client.match.findFirst({
              where: {
                status: 'LIVE',
                id: { not: args.where?.id }
              }
            });
            if (liveMatch) {
              throw new Error('Another match is already LIVE at RoshSpark Cricket Stadium. Cannot set this match to LIVE.');
            }
          }
          return query(args);
        }
      }
    }
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
