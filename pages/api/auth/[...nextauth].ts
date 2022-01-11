import {PrismaAdapter} from '@next-auth/prisma-adapter';
import {PrismaClient} from '@prisma/client';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/*
 * Constants.
 */

// Needed for Next Auth in production.
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

// Google Provider credentials.
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_SECRET ?? '';

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: async ({session, user}) => {
      const sessionUser = {...user, id: user.id};
      const updatedSession = {...session, user: sessionUser};

      return Promise.resolve(updatedSession);
    }
  },
  providers: [GoogleProvider({clientId: googleClientId, clientSecret: googleClientSecret})],
  secret: nextAuthSecret
});
