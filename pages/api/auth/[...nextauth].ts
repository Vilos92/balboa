import {PrismaAdapter} from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import {makePrismaClient} from '../../../utils/prisma';

/*
 * Constants.
 */

// Needed for Next Auth in production.
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

// Google Provider credentials.
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const googleClientSecret = process.env.GOOGLE_SECRET ?? '';

const prisma = makePrismaClient();

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
