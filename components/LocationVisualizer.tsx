import {AxiosError} from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import {FC, useState} from 'react';
import ReactMapGL, {Marker} from 'react-map-gl';
import {styled} from 'twin.macro';

import {GetGeolocationResponse, geolocationApi} from '../pages/api/geolocation';
import {useDebounce} from '../utils/hooks';
import {useNetGet} from '../utils/hooks';

/*
 * Types.
 */

interface LocationVisualizerProps {
  location: string;
}

/*
 * Constants.
 */

const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/*
 * Styles.
 */

const StyledMapDiv = styled.div`
  height: 300px;
  position: relative;
`;

/*
 * Component.
 */

/**
 * Visualizes a latitude/longitude position on a map.
 * Cannot be rendered with SRR, and should be loaded dynamically.
 */
const LocationVisualizer: FC<LocationVisualizerProps> = ({location}) => {
  const debouncedLocation = useDebounce(location, 1000);

  const geolocationUrl = computeGeolocationUrl(debouncedLocation);

  const {data, error} = useNetGet<GetGeolocationResponse>(geolocationUrl);
  const [latitude, longitude] = computeLatLongFromResponse(data, error);

  console.log(latitude, longitude);

  const [zoom, setZoom] = useState(13);

  return (
    <StyledMapDiv>
      <ReactMapGL
        mapboxApiAccessToken={mapboxAccessToken}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        width='100%'
        height='100%'
        onViewportChange={viewport => setZoom(viewport.zoom)}
      >
        <Marker latitude={latitude} longitude={longitude} offsetLeft={-20} offsetTop={-10}>
          <span role='img' aria-label='push-pin'>
            📌
          </span>
        </Marker>
      </ReactMapGL>
    </StyledMapDiv>
  );
};

export default LocationVisualizer;

/*
 * Helpers.
 */

function computeGeolocationUrl(location: string): string | null {
  // SWR will skip the fetch if it is passed a null URL.
  if (location.length === 0) return null;

  const url = new URL(geolocationApi, window.location.origin);
  url.searchParams.set('query', location);

  return url.href;
}

function computeLatLongFromResponse(data: GetGeolocationResponse, error: AxiosError): [number, number] {
  if (!data || data.length === 0 || error) return [45.41, -122.66];

  const {latitude, longitude} = data[0];
  return [latitude, longitude];
}
