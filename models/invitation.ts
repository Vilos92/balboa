import {z} from 'zod';

import {makePrismaClient} from '../utils/prisma';
import {planSchema} from './plan';

/*
 * Zod.
 */

const InvitationStatusesEnumSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED']);

// Schema for an invitation retrieved from the database using prisma.
const dbInvitationSchema = z.object({
  createdAt: z.date(),
  planId: z.string(),
  email: z.string().email(),
  status: InvitationStatusesEnumSchema,
  plan: planSchema
});

// Schema for plans used by the server and client.
const invitationSchema = z.object({
  createdAt: z.date(),
  plan: planSchema,
  email: z.string().email(),
  status: InvitationStatusesEnumSchema
});

// Relational fields which should be returned to the client.
const invitationInclude = {
  plan: true
};

// Schema for invitation drafts. This is used to validate data which will be sent to the DB.
const invitationDraftSchema = z.object({
  planId: z.string().cuid(),
  email: z.string().email()
});

/*
 * Types.
 */

type DbInvitation = z.infer<typeof dbInvitationSchema>;
type Invitation = z.infer<typeof invitationSchema>;
type InvitationDraft = z.infer<typeof invitationDraftSchema>;

/*
 * Database operations.
 */

/**
 * Select invitations belonging to a specific email.
 */
export async function findInvitationsForEmail(email: string) {
  const prisma = makePrismaClient();

  const data = await prisma.invitation.findMany({
    where: {
      email
    },
    include: invitationInclude
  });

  const dbInvitations = decodeDbInvitations(data);
  return encodeInvitations(dbInvitations);
}

export async function saveInvitation(invitationDraft: InvitationDraft) {
  const prisma = makePrismaClient();

  const data = await prisma.invitation.create({
    data: invitationDraft,
    include: invitationInclude
  });

  const dbInvitation = decodeDbInvitation(data);
  return encodeInvitation(dbInvitation);
}

/*
 * Runtime decoding/encoding.
 */

/**
 * Used by the server to decode an invitation from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbInvitation(invitationRow: unknown): DbInvitation {
  return dbInvitationSchema.parse(invitationRow);
}

/**
 * Used by the server to decode an array of invitations from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbInvitations(invitationRows: readonly unknown[]): readonly DbInvitation[] {
  return z.array(dbInvitationSchema).parse(invitationRows);
}

/**
 * Used by the server to encode a invitation from
 * the database to be sent to the client.
 */
function encodeInvitation(invitationRow: DbInvitation): Invitation {
  const invitationBlob = {
    createdAt: invitationRow.createdAt.toISOString()
  };

  return invitationSchema.parse(invitationBlob);
}

/*
 * Used by the server to encode an array of invitations
 * from the database to be sent to the client.
 */
function encodeInvitations(invitationRows: readonly DbInvitation[]): readonly Invitation[] {
  return invitationRows.map(encodeInvitation);
}
