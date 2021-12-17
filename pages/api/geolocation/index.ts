import {NextApiRequest} from 'next';

import {Geolocation, getPositionStack} from '../../../externalApi/geocoder';
import {NetResponse} from '../../../utils/net';

/*
 * Types.
 */

export type GetGeolocationResponse = readonly Geolocation[];

/*
 * Constants.
 */

export const geolocationApi = '/api/geolocation';

/*
 * Request handler.
 */

export default async function handler(req: NextApiRequest, res: NetResponse<GetGeolocationResponse>) {
  const {query} = req.query;

  if (!query || query.length === 0) res.status(400).json({error: 'The query parameter is required'});

  const queryString = typeof query === 'string' ? query : query[0];

  const geolocation = await getPositionStack(queryString);

  res.status(200).json(geolocation.data);
}
