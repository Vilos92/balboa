import {date, z} from 'zod';

import {makePrismaClient} from '../utils/prisma';
import {userSchema} from './user';

/*
 * Zod.
 */

// Schema for user on plan retrieved from the database using prisma.
const dbUserOnPlanSchema = z.object({
  createdAt: z.date(),
  planId: z.string().cuid(),
  userId: z.string().cuid(),
  user: userSchema
});

// Schema for plans retrieved from the database using prisma.
export const dbPlanSchema = z.object({
  id: z.string().cuid(),
  hostUserId: z.string().cuid(),
  createdAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.date(),
  end: z.date(),
  location: z.string(),
  description: z.string(),
  hostUser: userSchema,
  users: z.array(dbUserOnPlanSchema)
});

// Schema for user on plan drafts.
const userOnPlanDraftSchema = z.object({
  userId: z.string().cuid(),
  planId: z.string().cuid()
});

// Schema for plans used by the server and client.
export const planSchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string(),
  deletedAt: z.string().optional(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string(),
  end: z.string(),
  location: z.string(),
  description: z.string(),
  hostUser: userSchema,
  users: z.array(userSchema)
});

// Relational fields which should be returned to the client.
export const planInclude = {
  hostUser: true,
  users: {include: {user: true}}
};

// Schema for plan drafts. This is used to validate data which will be sent to the DB.
export const planDraftSchema = z.object({
  id: z.string().cuid().optional(),
  hostUserId: z.string().cuid(),
  title: z.string().min(3).max(60),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string().min(13).max(30),
  end: z.string().min(13).max(30),
  location: z.string().min(3).max(60),
  description: z.string().max(1000)
});

/*
 * Types.
 */

type DbPlan = z.infer<typeof dbPlanSchema>;
export type Plan = z.infer<typeof planSchema>;
export type PlanDraft = z.infer<typeof planDraftSchema>;
type UserOnPlanDraft = z.infer<typeof userOnPlanDraftSchema>;

/*
 * Database operations.
 */

/**
 * Select a single plan by id.
 */
export async function findPlan(planId: string) {
  const prisma = makePrismaClient();

  const data = await prisma.plan.findUnique({
    where: {
      id: planId
    },
    include: planInclude
  });

  if (!data || data.deletedAt) return undefined;

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

/**
 * Select plans which have not yet started or ended.
 */
export async function findPlansForUser(userId: string) {
  const prisma = makePrismaClient();

  const data = await prisma.plan.findMany({
    where: {
      users: {
        some: {
          userId
        }
      },
      deletedAt: null
    },
    include: planInclude
  });

  const dbPlans = decodeDbPlans(data);
  return encodePlans(dbPlans);
}

export async function savePlan(planDraft: PlanDraft) {
  const prisma = makePrismaClient();

  // The host of this plan should automatically join.
  const users = {
    create: [{user: {connect: {id: planDraft.hostUserId}}}]
  };

  const draftBlob = {
    ...planDraft,
    users
  };

  const data = await prisma.plan.create({
    data: draftBlob,
    include: planInclude
  });

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

export async function updatePlan(planDraft: PlanDraft) {
  const prisma = makePrismaClient();

  // Check that this plan has not been deleted yet.
  if (!planDraft.id) return undefined;
  const plan = await findPlan(planDraft.id);
  if (!plan || plan.deletedAt) return undefined;

  const data = await prisma.plan.update({
    where: {
      id: planDraft.id
    },
    data: planDraft,
    include: planInclude
  });

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

/**
 * Soft-deletes the plan by updating the isDeleted field.
 */
export async function deletePlan(planId: string) {
  const prisma = makePrismaClient();

  const now = new Date();
  const planDraft = {deletedAt: now.toISOString()};

  const data = await prisma.plan.update({
    where: {
      id: planId
    },
    data: planDraft,
    include: planInclude
  });

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

export async function saveUserOnPlan(userOnPlanDraft: UserOnPlanDraft) {
  const prisma = makePrismaClient();

  const {planId, userId} = userOnPlanDraft;

  // Check that this plan has not been deleted yet.
  const plan = await findPlan(planId);
  if (!plan || plan.deletedAt) return undefined;

  const users = {
    create: [{user: {connect: {id: userId}}}]
  };

  const draftBlob = {
    users
  };

  const data = await prisma.plan.update({
    where: {
      id: planId
    },
    data: draftBlob,
    include: planInclude
  });

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

export async function deleteUserOnPlan(planId: string, userId: string) {
  const prisma = makePrismaClient();

  // Check that this plan has not been deleted yet.
  const plan = await findPlan(planId);
  if (!plan || plan.deletedAt) return undefined;

  await prisma.userOnPlan.delete({
    where: {
      planId_userId: {
        planId,
        userId
      }
    }
  });

  return findPlan(planId);
}

/*
 * Runtime decoding/encoding.
 */

/**
 * Used by the server to decode a plan from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbPlan(planRow: unknown): DbPlan {
  return dbPlanSchema.parse(planRow);
}

/**
 * Used by the server to decode an array of plans from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbPlans(planRows: readonly unknown[]): readonly DbPlan[] {
  return z.array(dbPlanSchema).parse(planRows);
}

/**
 * Used by the server to encode a plan from
 * the database to be sent to the client.
 */
export function encodePlan(planRow: DbPlan): Plan {
  const baseBlob = {
    id: planRow.id,
    createdAt: planRow.createdAt.toISOString(),
    title: planRow.title,
    color: planRow.color,
    start: planRow.start.toISOString(),
    end: planRow.end.toISOString(),
    location: planRow.location,
    description: planRow.description,
    hostUser: planRow.hostUser,
    users: planRow.users.map(userOnPlan => userOnPlan.user)
  };

  // Send neither null or undefined parameters to the client.
  const planBlob = planRow.deletedAt
    ? {
        ...baseBlob,
        deletedAt: planRow.deletedAt.toISOString()
      }
    : baseBlob;

  return planSchema.parse(planBlob);
}

/*
 * Used by the server to encode an array of plans
 * from the database to be sent to the client.
 */
function encodePlans(planRows: readonly DbPlan[]): readonly Plan[] {
  return planRows.map(encodePlan);
}

/**
 * Used by the server to encode a plan from the client for the database.
 * Does not handle any exceptions thrown by the parser.
 */
export function encodeDraftPlan(planBlob: unknown): PlanDraft {
  return planDraftSchema.parse(planBlob);
}

/**
 * Used by the server to encode a plan from the client for the database.
 * Does not handle any exceptions thrown by the parser.
 */
export function encodeDraftUserOnPlan(userOnPlanBlob: unknown): UserOnPlanDraft {
  return userOnPlanDraftSchema.parse(userOnPlanBlob);
}
