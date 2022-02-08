import {netGet} from '../utils/net';

/*
 * Types.
 */

export interface MapboxFeature {
  geometry: {
    coordinates: [number, number];
  };
}

interface GetMapboxGeocodingResponse {
  features: readonly MapboxFeature[];
}

/*
 * Constants.
 */

const mapboxGeocodingApi = 'https://api.mapbox.com/geocoding/v5/mapbox.places/:query.json';
const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

/*
 * Network.
 */

export function getMapboxGeocoding(query: string): Promise<GetMapboxGeocodingResponse> {
  const url = new URL(computeMapboxGeocodingUrl(query));

  url.searchParams.set('access_token', mapboxAccessToken);
  return netGet<GetMapboxGeocodingResponse>(url.href);
}

function computeMapboxGeocodingUrl(query: string) {
  return mapboxGeocodingApi.replace(':query', query);
}
