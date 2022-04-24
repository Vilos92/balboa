import {NextApiRequest} from 'next';
import {ZodIssue, z} from 'zod';

import {
  Plan,
  encodeDraftPlan,
  findPlan,
  findPlansForUser,
  planDraftSchema,
  planExists,
  savePlan,
  updatePlan
} from '../../../models/plan';
import {getSessionUser} from '../../../utils/auth';
import {NetResponse, netPatch, netPost, useNetGet} from '../../../utils/net';
import {validateSchema} from '../../../utils/schema';

/*
 * Constants.
 */

const plansUrl = '/api/plans';

// Schema used to validate plans posted to this endpoint.
const postPlanSchema = planDraftSchema.omit({id: true, hostUserId: true});

// Schema used to validate plans patched to this endpoint.
const patchPlanSchema = planDraftSchema.omit({hostUserId: true});

/*
 * Types.
 */

type ApiResponse = NetResponse<Plan | readonly Plan[]>;

export type PostPlan = z.infer<typeof postPlanSchema>;
export type PatchPlan = z.infer<typeof patchPlanSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await getHandler(req, res);
        break;
      case 'POST':
        await postHandler(req, res);
        break;
      case 'PATCH':
        await patchHandler(req, res);
        break;
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json({error});
  }
}

async function getHandler(req: NextApiRequest, res: NetResponse<readonly Plan[]>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const plans = await findPlansForUser(user.id);

  res.status(200).json(plans);
}

async function postHandler(req: NextApiRequest, res: NetResponse<Plan>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const {title, color, start, end, location, description} = req.body;

  const planBlob = {hostUserId: user.id, title, color, start, end, location, description};
  const planDraft = encodeDraftPlan(planBlob);

  const plan = await savePlan(planDraft);

  res.status(201).json(plan);
}

async function patchHandler(req: NextApiRequest, res: NetResponse<Plan>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }
  const {id, title, color, start, end, location, description} = req.body;

  const planBlob = {id, hostUserId: user.id, title, color, start, end, location, description};
  const planDraft = encodeDraftPlan(planBlob);

  const isPlanExists = await planExists(id);
  if (!isPlanExists) {
    res.status(404).json({error: 'Cannot update a plan which does not exist'});
    return;
  }

  const plan = await updatePlan(planDraft);

  res.status(201).json(plan);
}

/*
 * Client.
 */

export function postPlan(planBlob: PostPlan) {
  return netPost<Plan, PostPlan>(plansUrl, planBlob);
}

export function patchPlan(planBlob: PatchPlan) {
  return netPatch<Plan, PatchPlan>(plansUrl, planBlob);
}

/*
 * Hooks.
 */

export function useNetGetPlans() {
  return useNetGet<readonly Plan[]>(plansUrl);
}

/*
 * Helpers.
 */

/**
 * Used by the client to validate a plan before submission.
 * If any errors are encountered they are returned.
 */
export function validatePostPlan(planBlob: PostPlan): readonly ZodIssue[] | undefined {
  return validateSchema(postPlanSchema, planBlob);
}

export function validatePatchPlan(planBlob: PostPlan): readonly ZodIssue[] | undefined {
  return validateSchema(patchPlanSchema, planBlob);
}
