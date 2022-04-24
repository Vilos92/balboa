import {NextApiRequest} from 'next';
import {z} from 'zod';

import {
  Invitation,
  InvitationStatusesEnum,
  deleteInvitation as deleteInvitationFromDb,
  encodeUpdateInvitation,
  findInvitation,
  invitationUpdateDraftSchema,
  updateInvitation
} from '../../../../models/invitation';
import {encodeDraftUserOnPlan, findPlan, planExists, saveUserOnPlan} from '../../../../models/plan';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netDelete, netPatch, parseQueryString} from '../../../../utils/net';

/*
 * Constants.
 */

const invitationUrl = '/api/invitations/:invitationId';

// Schema used to validate invitations posted to this endpoint.
const patchInvitationSchema = invitationUpdateDraftSchema.omit({id: true});

/*
 * Types.
 */

type ApiResponse = NetResponse<Invitation>;

export type PatchInvitation = z.infer<typeof patchInvitationSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'PATCH':
        await patchHandler(req, res);
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

async function patchHandler(req: NextApiRequest, res: NetResponse<Invitation>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const {invitationId: invitationIdParam} = req.query;
  const invitationId = parseQueryString(invitationIdParam);

  const invitation = await findInvitation(invitationId);
  if (!invitation) {
    res.status(404).json({error: 'Invitation not found'});
    return;
  }

  const isPlanExists = await planExists(invitation.plan.id);
  if (!isPlanExists) {
    res.status(404).json({error: 'Cannot respond to invitation for a plan which does not exist'});
    return;
  }

  if (invitation.email !== user.email) {
    res.status(401).json({error: 'Invitation belongs to another user'});
    return;
  }

  if (invitation.status !== InvitationStatusesEnum.PENDING) {
    res.status(401).json({error: 'Invitation already has a response'});
    return;
  }

  const {status} = req.body;

  const invitationBlob = {
    id: invitationId,
    status
  };
  const invitationDraft = encodeUpdateInvitation(invitationBlob);
  const updatedInvitation = await updateInvitation(invitationDraft);

  // If the invitation was accepted the user needs to be an attendee.
  if (status === InvitationStatusesEnum.ACCEPTED) {
    const {plan} = invitation;

    // Nothing to do if the user is already an attendee.
    const attendeeIds = new Set(plan.users.map(user => user.id));
    if (!attendeeIds.has(user.id)) {
      const userOnPlanBlob = {userId: user.id, planId: plan.id};
      const userOnPlanDraft = encodeDraftUserOnPlan(userOnPlanBlob);

      await saveUserOnPlan(userOnPlanDraft);
    }
  }

  res.status(201).json(updatedInvitation);
}

async function deleteHandler(req: NextApiRequest, res: NetResponse) {
  const user = await getSessionUser(req);
  const {invitationId: invitationIdParam} = req.query;
  const invitationId = parseQueryString(invitationIdParam);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const invitation = await findInvitation(invitationId);
  if (!invitation) {
    res.status(404).json({error: 'Invitation not found'});
    return;
  }

  // Check that current user either sent the invitation or is the plan host.
  const {senderUser, plan: hostUser} = invitation;
  if (senderUser.id !== user.id && hostUser.id !== user.id) {
    res.status(401).json({error: 'Invitation and plan belong to different users'});
    return;
  }

  await deleteInvitationFromDb(invitationId);

  res.status(204).end();
}

/*
 * Client.
 */

export function patchInvitation(invitationId: string, invitationBlob: PatchInvitation) {
  const url = computeInvitationUrl(invitationId);

  return netPatch<Invitation, PatchInvitation>(url, invitationBlob);
}

export function deleteInvitation(invitationId: string) {
  const url = computeInvitationUrl(invitationId);

  return netDelete(url);
}

/*
 * Hooks.
 */

/*
 * Helpers.
 */

export function computeInvitationUrl(invitationId: string) {
  return invitationUrl.replace(':invitationId', invitationId.toString());
}
