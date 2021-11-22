import {netGet} from '../utils/net';

/*
 * Types.
 */

export interface GetPositionStackResponse {
  data: {
    latitude: number;
    longitude: number;
    label: string;
  };
}

/*
 * Constants.
 */

const positionStackForwardApi = 'http://api.positionstack.com/v1/forward';
const positionStackAccessKey = process.env.POSITIONSTACK_ACCESS_KEY;

/*
 * Network.
 */

export function getPositionStack(query: string) {
  const url = new URL(positionStackForwardApi);
  url.searchParams.set('access_key', positionStackAccessKey);
  url.searchParams.set('query', query);

  return netGet<GetPositionStackResponse>(url.href);
}
