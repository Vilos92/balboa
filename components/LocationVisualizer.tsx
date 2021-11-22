import 'mapbox-gl/dist/mapbox-gl.css';
import {FC, useState} from 'react';
import ReactMapGL from 'react-map-gl';
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

  const url = new URL(geolocationApi, window.location.origin);
  url.searchParams.set('query', debouncedLocation);

  const {data, error} = useNetGet<GetGeolocationResponse>(url.href);

  const [zoom, setZoom] = useState(13);

  if (!data || data.length === 0 || error) return null;
  const {latitude, longitude} = data[0];

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
      />
    </StyledMapDiv>
  );
};

export default LocationVisualizer;
