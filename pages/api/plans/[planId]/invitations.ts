import {NextApiRequest} from 'next';
import {z} from 'zod';

import {
  Invitation,
  encodeDraftInvitation,
  invitationDraftSchema,
  saveInvitation
} from '../../../../models/invitation';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netPost, parseQueryString} from '../../../../utils/net';

/*
 * Constants.
 */

const planInvitationsUrl = '/api/plans/:planId/invitations';

// Schema used to validate plans posted to this endpoint.
const postInvitationSchema = invitationDraftSchema.omit({planId: true, senderUserId: true});

/*
 * Types.
 */

type ApiResponse = NetResponse<Invitation>;

export type PostInvitation = z.infer<typeof postInvitationSchema>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'POST':
        await postHandler(req, res);
        break;
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json({error});
  }
}

async function postHandler(req: NextApiRequest, res: NetResponse<Invitation>) {
  const user = await getSessionUser(req);

  const {planId: planIdParam} = req.query;
  const planId = parseQueryString(planIdParam);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const {email} = req.body;

  const invitationBlob = {planId, email, senderUserId: user.id};
  const invitationDraft = encodeDraftInvitation(invitationBlob);

  const invitation = await saveInvitation(invitationDraft);

  res.status(200).json(invitation);
}

/*
 * Client.
 */

export function postInvitation(planId: string, invitationBlob: PostInvitation) {
  const planInvitationsUrl = computePlanInvitationsUrl(planId);

  return netPost<Invitation, PostInvitation>(planInvitationsUrl, invitationBlob);
}

/*
 * Helpers.
 */

function computePlanInvitationsUrl(planId: string) {
  return planInvitationsUrl.replace(':planId', planId.toString());
}
