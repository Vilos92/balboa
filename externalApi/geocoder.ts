import {netGet} from '../utils/net';

/*
 * Types.
 */

export interface Geolocation {
  latitude: number;
  longitude: number;
  label: string;
}

export interface GetPositionStackResponse {
  data: readonly Geolocation[];
}

/*
 * Constants.
 */

const positionStackForwardApi = 'http://api.positionstack.com/v1/forward';
const positionStackAccessKey = process.env.POSITIONSTACK_ACCESS_KEY;

/*
 * Network.
 */

export function getPositionStack(query: string): Promise<GetPositionStackResponse> {
  const url = new URL(positionStackForwardApi);
  url.searchParams.set('access_key', positionStackAccessKey);
  url.searchParams.set('query', query);

  return netGet<GetPositionStackResponse>(url.href);
}
