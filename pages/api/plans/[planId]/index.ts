import {NextApiRequest} from 'next';

import {Plan, deletePlan as deletePlanFromDb, findPlan} from '../../../../models/plan';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netDelete, parseQueryString, useNetGet} from '../../../../utils/net';

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
      case 'DELETE':
        await deleteHandler(req, res);
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

async function deleteHandler(req: NextApiRequest, res: NetResponse) {
  const user = await getSessionUser(req);

  const {planId: planIdParam} = req.query;
  const planId = parseQueryString(planIdParam);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const plan = await findPlan(planId);
  if (!plan) {
    res.status(404).json({error: 'Plan not found'});
    return;
  }

  // Validate that this user is the host.
  if (plan.hostUser.id !== user.id) {
    res.status(401).json({error: 'Plan belongs to another user'});
    return;
  }

  await deletePlanFromDb(planId);

  res.status(204).end();
}

/*
 * Client.
 */

export function deletePlan(planId: string) {
  const url = computePlanUrl(planId);

  return netDelete(url);
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
