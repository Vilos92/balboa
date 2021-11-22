import {NextApiRequest, NextApiResponse} from 'next';

import {GetPositionStackResponse, getPositionStack} from '../../externalApi/geocoder';

/*
 * Types.
 */

export interface GetGeolocationResponse {
  data: {
    latitude: number;
    longitude: number;
    label: string;
  };
}

interface NetworkResponse {
  message: string;
}

/*
 * Constants.
 */

export const geolocationApi = '/api/geolocation';

/*
 * Request handler.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetPositionStackResponse | NetworkResponse>
) {
  const {query} = req.query;

  if (!query || query.length === 0) res.status(400).json({message: 'The query parameter is required'});

  const queryString = typeof query === 'string' ? query : query[0];

  const geolocation = await getPositionStack(queryString);

  res.status(200).json(geolocation);
}
