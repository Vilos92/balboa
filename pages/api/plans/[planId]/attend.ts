import {NextApiRequest} from 'next';

import {
  InvitationStatusesEnum,
  encodeUpdateInvitation,
  findInvitationForPlanAndEmail,
  updateInvitation
} from '../../../../models/invitation';
import {
  Plan,
  deleteUserOnPlan,
  encodeDraftUserOnPlan,
  planExists,
  saveUserOnPlan
} from '../../../../models/plan';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netDelete, netPost, parseQueryString} from '../../../../utils/net';

/*
 * Constants.
 */

const planAttendUrl = '/api/plans/:planId/attend';

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
      case 'POST':
        await postHandler(req, res);
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

async function postHandler(req: NextApiRequest, res: NetResponse<Plan>) {
  const user = await getSessionUser(req);

  const {planId: planIdParam} = req.query;
  const planId = parseQueryString(planIdParam);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const isPlanExists = await planExists(planId);
  if (!isPlanExists) {
    res.status(404).json({error: 'Cannot attend a plan which does not exist'});
    return;
  }

  const userOnPlanBlob = {userId: user.id, planId};
  const userOnPlanDraft = encodeDraftUserOnPlan(userOnPlanBlob);

  const plan = await saveUserOnPlan(userOnPlanDraft);

  // If an invitation exist for this plan and user, mark it as accepted.
  const invitation = await findInvitationForPlanAndEmail(planId, user.email);
  if (invitation && invitation.status !== InvitationStatusesEnum.ACCEPTED) {
    const invitationBlob = {
      id: invitation.id,
      status: InvitationStatusesEnum.ACCEPTED
    };
    const invitationDraft = encodeUpdateInvitation(invitationBlob);
    await updateInvitation(invitationDraft);
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

  const isPlanExists = await planExists(planId);
  if (!isPlanExists) {
    res.status(404).json({error: 'Cannot unattend a plan which does not exist'});
    return;
  }

  await deleteUserOnPlan(planId, user.id);

  // If any invitations exist for this plan and user, mark it as declined.
  const invitation = await findInvitationForPlanAndEmail(planId, user.email);
  if (invitation && invitation.status !== InvitationStatusesEnum.DECLINED) {
    const invitationBlob = {
      id: invitation.id,
      status: InvitationStatusesEnum.DECLINED
    };
    const invitationDraft = encodeUpdateInvitation(invitationBlob);
    await updateInvitation(invitationDraft);
  }

  res.status(204).end();
}

/*
 * Client.
 */

export function postPlanAttend(planId: string) {
  const url = computePlanAttendUrl(planId);

  return netPost<Plan>(url);
}

export function deletePlanAttend(planId: string) {
  const url = computePlanAttendUrl(planId);

  return netDelete(url);
}

/*
 * Helpers.
 */

function computePlanAttendUrl(planId: string) {
  return planAttendUrl.replace(':planId', planId.toString());
}
