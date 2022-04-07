import {NextApiRequest} from 'next';
import {z} from 'zod';

import {
  Invitation,
  encodeDraftInvitation,
  findInvitation,
  invitationDraftSchema,
  updateInvitation
} from '../../../../models/invitation';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netPatch, parseQueryString} from '../../../../utils/net';

/*
 * Constants.
 */

const invitationUrl = '/api/invitations/:invitationId';

// Schema used to validate invitations posted to this endpoint.
const patchInvitationSchema = invitationDraftSchema.omit({planId: true, email: true, senderUserId: true});

/*
 * Types.
 */

type ApiResponse = NetResponse<Invitation>;

type PatchInvitation = z.infer<typeof patchInvitationSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
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

  if (invitation.email !== user.email) {
    res.status(401).json({error: 'Invitation belongs to another user'});
    return;
  }

  const {status} = req.body;

  const invitationBlob = {id: invitationId, status};
  const invitationDraft = encodeDraftInvitation(invitationBlob);

  const updatedInvitation = await updateInvitation(invitationDraft);

  res.status(201).json(updatedInvitation);
}

/*
 * Client.
 */

export function patchPlan(invitationId: string, invitationBlob: PatchInvitation) {
  const url = computeInvitationUrl(invitationId);

  return netPatch<Invitation, PatchInvitation>(url, invitationBlob);
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
