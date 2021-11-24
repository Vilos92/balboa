import {NextApiRequest, NextApiResponse} from 'next';

import {PlanDraft, PlanModel, savePlan} from '../../../models/plan';

/*
 * Constants.
 */

export const plansUrl = '/api/plans';

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse<PlanModel>) {
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

async function postHandler(req: NextApiRequest, res: NextApiResponse<PlanModel>) {
  const {title, color, start, end, location, description} = req.body;

  const planDraft: PlanDraft = {title, color, start, end, location, description};

  const {data, error} = await savePlan(planDraft);
  if (!data || data.length === 0 || error) throw error;

  res.status(200).json(data[0]);
}
