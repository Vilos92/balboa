import {FC} from 'react';

import {useNetGetInvitationsForUser} from '../api/invitations';

/*
 * Page.
 */

const InvitationsPage: FC = () => {
  // const {data: invites, error2, mutate} = useNetGetInvitationsForUser();
  // console.log('invites', invites, error2);

  return <>Hello invitations</>;
};

export default InvitationsPage;
