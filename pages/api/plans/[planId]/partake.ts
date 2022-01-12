import {NextApiRequest, NextApiResponse} from 'next';

import {Plan, encodeDraftUserOnPlan, saveUserOnPlan} from '../../../../models/plan';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netPost, parseQueryNumber} from '../../../../utils/net';

/*
 * Constants.
 */

const planPartakeUrl = '/api/plans/:planId/partake';

/*
 * Types.
 */

type ApiResponse = NextApiResponse<Plan | {error: unknown}>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        await postHandler(req, res);
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json({error});
  }
}

async function postHandler(req: NextApiRequest, res: NetResponse<Plan>) {
  const user = await getSessionUser(req);

  const {planId: planIdParam} = req.query;
  const planId = parseQueryNumber(planIdParam);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const userOnPlanBlob = {userId: user.id, planId};
  const userOnPlanDraft = encodeDraftUserOnPlan(userOnPlanBlob);

  const plan = await saveUserOnPlan(userOnPlanDraft);

  res.status(200).json(plan);
}

/*
 * Client.
 */

export function postPlanPartake(planId: number) {
  const url = planPartakeUrl.replace(':planId', planId.toString());

  return netPost<{}, Plan>(url);
}
