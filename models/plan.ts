import {PostgrestResponse} from '@supabase/supabase-js';

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

  return supabase.from<PlanModel>('plan').select(`title, color, start, end, location, description`);
}

export async function savePlan(planDraft: PlanDraft): Promise<PostgrestResponse<PlanModel>> {
  const supabase = makeSupabaseClient();

  return supabase.from<PlanModel>('plan').insert(planDraft);
}
