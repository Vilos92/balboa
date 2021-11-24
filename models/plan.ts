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
 * Database operations.
 */

export async function findPlan(planId: number) {
  const supabase = makeSupabaseClient();

  const {data: plans, error} = await supabase
    .from<PlanModel>('plan')
    .select('title, color, start, end, location, description')
    .filter('id', 'eq', planId)
    .limit(1);

  return {plan: plans[0], error};
}

export async function savePlan(planDraft: PlanDraft) {
  const supabase = makeSupabaseClient();

  const {data: plans, error} = await supabase.from<PlanModel>('plan').insert(planDraft);

  return {plans, error};
}
