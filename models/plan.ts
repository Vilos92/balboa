import {z} from 'zod';

import {makePrismaClient} from '../utils/prisma';

/*
 * Constants.
 */

// Schema for plans retrieved from the database using prisma.
const dbPlanSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.date(),
  end: z.date(),
  location: z.string(),
  description: z.string()
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
  description: z.string()
});

// Fields in the DB which can be returned to the client.
const clientFields = ['id', 'createdAt', 'title', 'color', 'start', 'end', 'location', 'description'];
const clientFieldsSelect = clientFields.reduce<{[key: string]: boolean}>((m, v) => ((m[v] = true), m), {});

// Schema for plan drafts. This is used to validate data
// received from the API, and has stricter requirements.
export const planDraftSchema = z.object({
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

export type DbPlanModel = z.infer<typeof dbPlanSchema>;
export type PlanModel = z.infer<typeof planSchema>;
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
    select: clientFieldsSelect
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
    select: clientFieldsSelect
  });

  const dbPlans = decodeDbPlans(data);
  return encodePlans(dbPlans);
}

export async function savePlan(planDraft: PlanDraft) {
  const prisma = makePrismaClient();

  const data = await prisma.plan.create({
    data: planDraft
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
function decodeDbPlan(planRow: unknown): DbPlanModel {
  return dbPlanSchema.parse(planRow);
}

/**
 * Used by the server to decode an array of plans from the database.
 * Does not handle any exceptions thrown by the parser.
 */
function decodeDbPlans(planRows: readonly unknown[]): readonly DbPlanModel[] {
  return z.array(dbPlanSchema).parse(planRows);
}

/**
 * Used by the server to encode a plan from
 * the database to be sent to the client.
 */
function encodePlan(planRow: DbPlanModel): PlanModel {
  const planBlob = {
    id: planRow.id,
    createdAt: planRow.createdAt.toISOString(),
    title: planRow.title,
    color: planRow.color,
    start: planRow.start.toISOString(),
    end: planRow.end.toISOString(),
    location: planRow.location,
    description: planRow.description
  };

  return planSchema.parse(planBlob);
}

/*
 * Used by the server to encode an array of plans
 * from the database to be sent to the client.
 */
function encodePlans(planRows: readonly DbPlanModel[]): readonly PlanModel[] {
  return planRows.map(encodePlan);
}
