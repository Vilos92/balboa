import {NextApiRequest} from 'next';

import {Plan, findPlan} from '../../../../models/plan';
import {NetResponse, parseQueryString, useNetGet} from '../../../../utils/net';

/*
 * Constants.
 */

const planUrl = '/api/plans/:planId';

/*
 * Types.
 */

type ApiResponse = NetResponse<Plan>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await getHandler(req, res);
        break;
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json({error});
  }
}

async function getHandler(req: NextApiRequest, res: NetResponse<Plan>) {
  const {planId: planIdParam} = req.query;
  const planId = parseQueryString(planIdParam);

  const plan = await findPlan(planId);

  if (!plan) {
    res.status(404).json({error: 'Plan not found'});
    return;
  }

  res.status(200).json(plan);
}

/*
 * Hooks.
 */

export function useNetGetPlan(planId: string) {
  const url = computePlanUrl(planId);

  return useNetGet<Plan>(url);
}

/*
 * Helpers.
 */

export function computePlanUrl(planId: string) {
  return planUrl.replace(':planId', planId.toString());
}
