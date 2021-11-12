import {NextApiRequest, NextApiResponse} from 'next';

import {netGet} from '../../utils/net';

/*
 * Types.
 */

interface TvMazeShow {
  id: number;
  name: string;
  genres: ReadonlyArray<string>;
  image: {
    medium: string;
  };
}

export type FetchShowsResponse = ReadonlyArray<TvMazeShow>;

export type FetchShowResponse = TvMazeShow;

/*
 * Constants.
 */

export const externalShowsUrl = 'https://api.tvmaze.com/shows?page=1';

export const externalShowUrl = 'https://api.tvmaze.com/shows/';

export const showsUrl = '/api/shows';

/*
 * Request handler.
 */

export default async function handler(_req: NextApiRequest, res: NextApiResponse<FetchShowsResponse>) {
  const shows = await getExternalShows();

  res.status(200).json(shows);
}

/*
 * Helpers.
 */

export function getExternalShows() {
  return netGet<FetchShowsResponse>(externalShowsUrl);
}

export function getExternalShow(showId: number) {
  const url = new URL(showId.toString(), externalShowUrl).href;

  return netGet<FetchShowResponse>(url);
}
