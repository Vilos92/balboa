import {ZodError, z} from 'zod';

import {makeSupabaseClient} from '../utils/supabase';

/*
 * Types.
 */

export interface PlanModel {
  id: number;
  created_at: string;
  title: string;
  color: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

export type PlanDraft = Pick<PlanModel, 'title' | 'color' | 'start' | 'end' | 'location' | 'description'>;

/*
 * Constants.
 */

const clientFields = 'id, title, color, start, end, location, description';

const dbPlanSchema = z.object({
  id: z.number(),
  title: z.string(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string(),
  end: z.string(),
  location: z.string(),
  description: z.string()
});

type DbPlanModel = z.infer<typeof dbPlanSchema>;

/*
 * Database operations.
 */

/**
 * Select a single plan by id.
 */
export async function findPlan(planId: number) {
  const supabase = makeSupabaseClient();

  const {data: plans, error} = await supabase
    .from<DbPlanModel>('plan')
    .select(clientFields)
    .filter('id', 'eq', planId)
    .limit(1);

  const plan = decodeDbPlan(plans?.[0]);

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

  const plans = decodeDbPlans(data);

  return {plans, error};
}

export async function savePlan(planDraft: PlanDraft) {
  const supabase = makeSupabaseClient();

  const {data: plans, error} = await supabase.from<PlanModel>('plan').insert(planDraft);

  const plan = decodeDbPlan(plans?.[0]);

  return {plan, error};
}

/*
 * Helpers.
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
