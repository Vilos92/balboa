import {NextApiRequest} from 'next';
import {z} from 'zod';

import {
  Invitation,
  InvitationStatusesEnum,
  encodeDraftInvitation,
  findInvitationForPlanAndEmail,
  invitationDraftSchema,
  saveInvitation
} from '../../../../models/invitation';
import {findPlan} from '../../../../models/plan';
import {getSessionUser} from '../../../../utils/auth';
import {NetResponse, netPost, parseQueryString} from '../../../../utils/net';
import {validateEmail} from '../../../../utils/schema';

/*
 * Constants.
 */

const planInvitationsUrl = '/api/plans/:planId/invitations';

// Schema used to validate plans posted to this endpoint.
const postInvitationSchema = invitationDraftSchema.omit({planId: true, senderUserId: true});

const maxAttendeeCount = 100;

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
  if (!user) {
    res.status(401).send({error: 'Unauthorized'});
    return;
  }

  const {planId: planIdParam} = req.query;
  const planId = parseQueryString(planIdParam);

  const {email} = req.body;
  const error = validateEmail(email);
  if (error) {
    res.status(400).json({error});
    return;
  }

  const plan = await findPlan(planId);
  if (!plan) {
    res.status(404).json({error: 'Plan not found'});
    return;
  }

  // Make sure the current user is an attendee.
  const attendeeEmails = new Set(plan.users.map(user => user.email));

  // Enforce a limit to the max number of attendees in a plan.
  if (attendeeEmails.size >= maxAttendeeCount) {
    res.status(400).send({
      error: `There are already ${attendeeEmails.size} / ${maxAttendeeCount} people attending this event.`
    });
    return;
  }

  // Do not allow sending invitations unless the current user is attending.
  if (!attendeeEmails.has(user.email)) {
    res.status(401).send({error: 'Only attendees can invite others'});
    return;
  }

  // Return a specific error code for emails which already exist.
  const existingInvitation = await findInvitationForPlanAndEmail(planId, email);
  if (existingInvitation) {
    res.status(303).send({error: `Invitation already exists for: ${email}`});
    return;
  }

  // If already attending this user will receive an ACCEPTED invitation (hidden in UI).
  const isAlreadyAttending = attendeeEmails.has(email);
  const invitationBlob = computeInvitationBlob(planId, email, user.id, isAlreadyAttending);

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

/**
 * If the person being invited's email is among attendees, create an ACCEPTED invitation.
 */
function computeInvitationBlob(
  planId: string,
  email: string,
  senderUserId: string,
  isAlreadyAttending: boolean
) {
  const invitationBlob = {planId, email, senderUserId};

  if (isAlreadyAttending) {
    return {...invitationBlob, status: InvitationStatusesEnum.ACCEPTED};
  }

  return invitationBlob;
}
