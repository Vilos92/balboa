import {z} from 'zod';

import {makePrismaClient} from '../utils/prisma';
import {computeFieldsSelect} from '../utils/schema';
import {userSchema} from './user';

/*
 * Constants.
 */

// Schema for user on plan retrieved from the database using prisma.
const dbUserOnPlanSchema = z.object({
  createdAt: z.date(),
  planId: z.number(),
  userId: z.number(),
  user: userSchema
});

// Schema for plans retrieved from the database using prisma.
const dbPlanSchema = z.object({
  hostUserId: z.number(),
  id: z.number(),
  createdAt: z.date(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.date(),
  end: z.date(),
  location: z.string(),
  description: z.string(),
  HostUser: userSchema,
  users: z.array(dbUserOnPlanSchema)
});

// Schema for plans used by the server and client.
const planSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
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
const planInclude = {
  HostUser: true,
  users: {include: {user: true}}
};

// Schema for plan drafts. This is used to validate data which will be sent to the DB.
export const planDraftSchema = z.object({
  hostUserId: z.number(),
  title: z.string().min(3).max(30),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string().min(13).max(30),
  end: z.string().min(13).max(30),
  location: z.string().min(3).max(30),
  description: z.string().max(300)
});

/*
 * Types.
 */

type DbPlan = z.infer<typeof dbPlanSchema>;
export type Plan = z.infer<typeof planSchema>;
export type PlanDraft = z.infer<typeof planDraftSchema>;

/*
 * Database operations.
 */

/**
 * Select a single plan by id.
 */
export async function findPlan(planId: number) {
  const prisma = makePrismaClient();

  const data = await prisma.plan.findUnique({
    where: {
      id: planId
    },
    include: planInclude
  });

  const dbPlan = decodeDbPlan(data);
  return encodePlan(dbPlan);
}

/**
 * Select plans which have not yet started or ended.
 */
export async function findPlans() {
  const prisma = makePrismaClient();

  const data = await prisma.plan.findMany({
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
function encodePlan(planRow: DbPlan): Plan {
  const planBlob = {
    id: planRow.id,
    createdAt: planRow.createdAt.toISOString(),
    title: planRow.title,
    color: planRow.color,
    start: planRow.start.toISOString(),
    end: planRow.end.toISOString(),
    location: planRow.location,
    description: planRow.description,
    hostUser: planRow.HostUser,
    users: planRow.users.map(userOnPlan => userOnPlan.user)
  };

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
