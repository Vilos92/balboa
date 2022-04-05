import {NextApiRequest} from 'next';

import {Invitation, findInvitationsForEmail} from '../../../models/invitation';
import {getSessionUser} from '../../../utils/auth';
import {NetResponse, useNetGet} from '../../../utils/net';

/*
 * Constants.
 */

const invitationsUrl = '/api/invitations';

/*
 * Types.
 */

type ApiResponse = NetResponse<readonly Invitation[]>;

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: ApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await getHandler(req, res);
        break;
      default:
        res.status(404);
    }
  } catch (error) {
    res.status(500).json({error});
  }
}

async function getHandler(req: NextApiRequest, res: NetResponse<readonly Invitation[]>) {
  const user = await getSessionUser(req);

  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const invitations = await findInvitationsForEmail(user.email);

  res.status(200).json(invitations);
}

/*
 * Hooks.
 */

export function useNetGetInvitationsForUser() {
  return useNetGet<readonly Invitation[]>(invitationsUrl);
}
