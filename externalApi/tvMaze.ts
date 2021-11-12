import {netGet} from '../utils/net';

/*
 * Types.
 */

export interface TvMazeShow {
  id: number;
  name: string;
  genres: ReadonlyArray<string>;
  image: {
    medium: string;
  };
}

export type GetTvMazeShowsResponse = ReadonlyArray<TvMazeShow>;
export type GetTvMazeShowResponse = TvMazeShow;

/*
 * Constants.
 */

export const tvMazeShowsUrl = 'https://api.tvmaze.com/shows';

/*
 * Network.
 */

export function getTvMazeShows(page: number) {
  const url = new URL(tvMazeShowsUrl);
  url.searchParams.set('page', page.toString());

  return netGet<GetTvMazeShowsResponse>(url.href);
}

export function getTvMazeShow(showId: number) {
  // TODO: Use proper helper for adding slashes in these cases.
  const tvMazeShowsUrlWithPath = `${tvMazeShowsUrl}/`;
  const url = new URL(showId.toString(), tvMazeShowsUrlWithPath);

  return netGet<GetTvMazeShowResponse>(url.href);
}
