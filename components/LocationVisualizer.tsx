import {AxiosError} from 'axios';
import 'mapbox-gl/dist/mapbox-gl.css';
import {FC, useState} from 'react';
import ReactMapGL, {Marker, ViewportProps} from 'react-map-gl';
import tw, {styled} from 'twin.macro';

import {GetGeolocationResponse, geolocationApi} from '../pages/api/geolocation';
import MapStyle from '../styles/map-style-basic-v8.json';
import {useDebounce} from '../utils/hooks';
import {useNetGet} from '../utils/net';

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
  height: 200px;
  position: relative;
`;

const StyledMockDiv = tw.div`
  h-full
  w-full
  bg-blue-300
`;

/*
 * Component.
 */

/**
 * Visualizes a latitude/longitude position on a map.
 * Cannot be rendered with SRR, and should be loaded dynamically.
 */
const LocationVisualizer: FC<LocationVisualizerProps> = ({location}) => {
  const [zoom, setZoom] = useState(13);
  const onViewportChange = (viewport: ViewportProps) => viewport.zoom && setZoom(viewport.zoom);

  const debouncedLocation = useDebounce(location, 1000);
  const geolocationUrl = computeGeolocationUrl(debouncedLocation) ?? '';

  const {data, error} = useNetGet<GetGeolocationResponse>(geolocationUrl);
  if (!data || error) return <LocationVisualizerMock />;

  const [latitude, longitude] = computeLatLongFromResponse(data);

  return (
    <StyledMapDiv>
      <ReactMapGL
        mapboxApiAccessToken={mapboxAccessToken}
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        width='100%'
        height='100%'
        mapStyle={MapStyle}
        onViewportChange={onViewportChange}
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

export const LocationVisualizerMock: FC = () => {
  return (
    <StyledMapDiv>
      <StyledMockDiv />
    </StyledMapDiv>
  );
};

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

function computeLatLongFromResponse(data: GetGeolocationResponse): [number, number] {
  if (!data || data.length === 0) return [45.41, -122.66];

  const {latitude, longitude} = data[0];
  return [latitude, longitude];
}
