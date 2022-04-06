import {z} from 'zod';

import {makePrismaClient} from '../utils/prisma';
import {dbPlanSchema, encodePlan, planInclude, planSchema} from './plan';
import {userSchema} from './user';

/*
 * Zod.
 */

const invitationStatusesEnumSchema = z.enum(['PENDING', 'ACCEPTED', 'DECLINED']);

// Schema for an invitation retrieved from the database using prisma.
const dbInvitationSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  planId: z.string(),
  email: z.string().email(),
  status: invitationStatusesEnumSchema,
  plan: dbPlanSchema,
  senderUser: userSchema
});

// Schema for plans used by the server and client.
const invitationSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  plan: planSchema,
  email: z.string().email(),
  status: invitationStatusesEnumSchema,
  senderUser: userSchema
});

// Relational fields which should be returned to the client.
const invitationInclude = {
  senderUser: true,
  plan: {include: planInclude}
};

// Schema for invitation drafts. This is used to validate data which will be sent to the DB.
export const invitationDraftSchema = z.object({
  planId: z.string().cuid(),
  senderUserId: z.string().cuid(),
  email: z.string().email(),
  status: z.optional(invitationStatusesEnumSchema)
});

/*
 * Types.
 */

export const InvitationStatusesEnum = invitationStatusesEnumSchema.enum;
type DbInvitation = z.infer<typeof dbInvitationSchema>;
export type Invitation = z.infer<typeof invitationSchema>;
type InvitationDraft = z.infer<typeof invitationDraftSchema>;

/*
 * Database operations.
 */

/**
 * Select an invitation belonging to a specific plan and email.
 */
export async function findInvitationForPlanAndEmail(planId: string, email: string) {
  const prisma = makePrismaClient();

  const data = await prisma.invitation.findUnique({
    where: {
      planId_email: {planId: planId, email}
    },
    include: invitationInclude
  });

  if (!data) return undefined;

  const dbInvitation = decodeDbInvitation(data);
  return encodeInvitation(dbInvitation);
}

/**
 * Select pending invitations belonging to a specific email.
 */
export async function findPendingInvitationsForEmail(email: string) {
  const prisma = makePrismaClient();

  const data = await prisma.invitation.findMany({
    where: {
      email,
      status: InvitationStatusesEnum.PENDING
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
    id: invitationRow.id,
    createdAt: invitationRow.createdAt.toISOString(),
    email: invitationRow.email,
    status: invitationRow.status,
    plan: encodePlan(invitationRow.plan),
    senderUser: invitationRow.senderUser
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

/**
 * Used by the server to encode an invitation from the client for the database.
 * Does not handle any exceptions thrown by the parser.
 */
export function encodeDraftInvitation(invitationBlob: unknown): InvitationDraft {
  return invitationDraftSchema.parse(invitationBlob);
}
