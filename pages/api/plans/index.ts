import {NextApiRequest, NextApiResponse} from 'next';
import {ZodIssue, z} from 'zod';

import {Plan, encodeDraftPlan, planDraftSchema, savePlan, updatePlan} from '../../../models/plan';
import {getSessionUser} from '../../../utils/auth';
import {NetResponse, netPatch, netPost} from '../../../utils/net';
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

type ApiResponse = NextApiResponse<Plan | {error: unknown}>;

export type PostPlan = z.infer<typeof postPlanSchema>;
export type PatchPlan = z.infer<typeof patchPlanSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
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

  const plan = await updatePlan(planDraft);

  res.status(201).json(plan);
}

/*
 * Client.
 */

export function postPlan(planBlob: PostPlan) {
  return netPost<PostPlan, Plan>(plansUrl, planBlob);
}

export function patchPlan(planBlob: PatchPlan) {
  return netPatch<PatchPlan, Plan>(plansUrl, planBlob);
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
