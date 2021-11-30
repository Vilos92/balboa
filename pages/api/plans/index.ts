import {NextApiRequest, NextApiResponse} from 'next';
import {ZodError, z} from 'zod';

import {PlanModel, savePlan} from '../../../models/plan';
import {netPost} from '../../../utils/net';

/*
 * Constants.
 */

const plansUrl = '/api/plans';

// Schema used to validate plans posted to this endpoint.
const postPlanSchema = z.object({
  title: z.string().min(3).max(30),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}/),
  start: z.string().min(13).max(30),
  end: z.string().min(13).max(30),
  location: z.string().min(3).max(30),
  description: z.string().max(300)
});

/*
 * Types.
 */

type PostPlanSchema = z.infer<typeof postPlanSchema>;

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

  const planBlob = {title, color, start, end, location, description};
  const planDraft = decodePostPlan(planBlob);

  const {plan, error} = await savePlan(planDraft);
  if (!plan || error) throw error;

  res.status(200).json(plan);
}

/*
 * Client.
 */

export function postPlan(planBlob: PostPlanSchema) {
  return netPost<PostPlanSchema, PlanModel>(plansUrl, planBlob);
}

/*
 * Helpers.
 */

/**
 * Used by the server to decode a plan from the client.
 * Does not handle any exceptions thrown by the parser.
 */
function decodePostPlan(planBlob: unknown): PostPlanSchema {
  return postPlanSchema.parse(planBlob);
}

/**
 * Used by the client to validate a plan before submission.
 * If any errors are encountered they are returned.
 */
export function validatePostPlan(planBlob: PostPlanSchema): ZodError<PostPlanSchema> | undefined {
  try {
    postPlanSchema.parse(planBlob);
    return undefined;
  } catch (error) {
    return error;
  }
}
