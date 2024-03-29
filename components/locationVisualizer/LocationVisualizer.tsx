import 'mapbox-gl/dist/mapbox-gl.css';
import {FC, useState} from 'react';
import ReactMapGL, {Marker, ViewportProps} from 'react-map-gl';
import tw, {styled} from 'twin.macro';

import {GetGeolocationResponse, geolocationApi} from '../../pages/api/geolocation';
import MapStyle from '../../styles/map-style-basic-v8.json';
import {useDebounceValue} from '../../utils/hooks';
import {useNetGet} from '../../utils/net';

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

const StyledMockDiv = styled.div`
  ${tw`
    h-full
    w-full
  `}

  background-color: #DEDEDE;
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

  const debouncedLocation = useDebounceValue(location, 1000);
  const geolocationUrl = computeGeolocationUrl(debouncedLocation) ?? '';

  const {data: mapboxFeatures, error} = useNetGet<GetGeolocationResponse>(geolocationUrl);
  if (!mapboxFeatures || error) return <LocationVisualizerMock />;

  const [latitude, longitude] = computeLatLongFromResponse(mapboxFeatures);

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

function computeLatLongFromResponse(mapboxFeatures: GetGeolocationResponse): [number, number] {
  if (!mapboxFeatures || mapboxFeatures.length === 0) return [45.41, -122.66];

  const [longitude, latitude] = mapboxFeatures[0].geometry.coordinates;

  // Return as lat/long for standard convention.
  return [latitude, longitude];
}
