import {NextApiRequest, NextApiResponse} from 'next';

import {makeSupabaseClient} from '../../utils/supabase';

/*
 * Types.
 */

interface PostPlanResponse {
  id: number;
  created_at: string;
  title: string;
  color: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

/*
 * Constants.
 */

export const plansUrl = '/api/plans';

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<PostPlanResponse>) {
  try {
    switch (req.method) {
      case 'POST':
        await postHandler(req, res);
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse<PostPlanResponse>) {
  const {title, color, start, end, location, description} = req.body;

  const supabase = makeSupabaseClient();

  const {data, error} = await supabase
    .from<PostPlanResponse>('plan')
    .insert({title, color, start, end, location, description});

  if (!data || data.length === 0 || error) throw error;

  res.status(200).json(data[0]);
}
