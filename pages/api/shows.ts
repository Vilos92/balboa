import {NextApiRequest, NextApiResponse} from 'next';

import {GetTvMazeShowsResponse, getTvMazeShows} from '../../externalApi/tvMaze';

/*
 * Constants.
 */

export const showsUrl = '/api/shows';

/*
 * Request handler.
 */

export default async function handler(_req: NextApiRequest, res: NextApiResponse<GetTvMazeShowsResponse>) {
  const shows = await getTvMazeShows();

  res.status(200).json(shows);
}
