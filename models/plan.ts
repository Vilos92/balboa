import {z} from 'zod';

import {makeSupabaseClient} from '../utils/supabase';

/*
 * Constants.
 */

// Schema for plans in the database.
const dbPlanSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string(),
  end: z.string(),
  location: z.string(),
  description: z.string()
});

// Fields in the DB which can be returned to the client.
const clientFields = 'id, created_at, title, color, start, end, location, description';

// Schema for plans used by the server and client.
const planSchema = dbPlanSchema.omit({created_at: true}).extend({createdAt: z.string()});

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

type DbPlanModel = z.infer<typeof dbPlanSchema>;
export type PlanModel = z.infer<typeof planSchema>;
type PlanDraft = z.infer<typeof planDraftSchema>;

/*
 * Database operations.
 */

/**
 * Select a single plan by id.
 */
export async function findPlan(planId: number) {
  const supabase = makeSupabaseClient();

  const {data, error} = await supabase
    .from<DbPlanModel>('plan')
    .select(clientFields)
    .filter('id', 'eq', planId)
    .limit(1);

  const dbPlan = decodeDbPlan(data?.[0]);
  const plan = encodePlan(dbPlan);

  return {plan, error};
}

/**
 * Select plans which have not yet started or ended.
 */
export async function findPlans() {
  const supabase = makeSupabaseClient();

  const {data, error} = await supabase
    .from<DbPlanModel>('plan')
    .select(clientFields)
    .filter('end', 'gte', new Date().toISOString())
    .order('start', {ascending: true})
    .limit(10);

  const dbPlans = decodeDbPlans(data);
  const plans = encodePlans(dbPlans);

  return {plans, error};
}

export async function savePlan(planDraft: PlanDraft) {
  const supabase = makeSupabaseClient();

  const {data, error} = await supabase.from<PlanModel>('plan').insert(planDraft);

  const dbPlan = decodeDbPlan(data?.[0]);
  const plan = encodePlan(dbPlan);

  return {plan, error};
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
function decodeDbPlans(planRows: unknown): readonly DbPlanModel[] {
  return z.array(dbPlanSchema).parse(planRows);
}

/**
 * Used by the server to encode a plan from
 * the database to be sent to the client.
 */
function encodePlan(planRow: DbPlanModel): PlanModel {
  const planBlob = {
    id: planRow.id,
    createdAt: planRow.created_at,
    title: planRow.title,
    color: planRow.color,
    start: planRow.start,
    end: planRow.end,
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
