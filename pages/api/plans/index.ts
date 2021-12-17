import {NextApiRequest, NextApiResponse} from 'next';
import {ZodIssue, z} from 'zod';

import {PlanModel, encodeDraftPlan, planDraftSchema, savePlan} from '../../../models/plan';
import {getSessionUser} from '../../../utils/auth';
import {NetResponse, netPost} from '../../../utils/net';
import {validateSchema} from '../../../utils/schema';

/*
 * Constants.
 */

const plansUrl = '/api/plans';

// Schema used to validate plans posted to this endpoint.
const postPlanSchema = planDraftSchema.omit({hostUserId: true});

/*
 * Types.
 */

type ApiResponse = NextApiResponse<PlanModel | {error: unknown}>;

export type PostPlan = z.infer<typeof postPlanSchema>;

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

async function postHandler(req: NextApiRequest, res: NetResponse<PlanModel>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }
  const {title, color, start, end, location, description} = req.body;

  const planBlob = {hostUserId: user.id, title, color, start, end, location, description};
  const planDraft = encodeDraftPlan(planBlob);

  const plan = await savePlan(planDraft);

  res.status(200).json(plan);
}

/*
 * Client.
 */

export function postPlan(planBlob: PostPlan) {
  return netPost<PostPlan, PlanModel>(plansUrl, planBlob);
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
