import {LatLngExpression} from 'leaflet';
import {FC} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
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
 * Styles.
 */

const StyledMapDiv = styled.div`
  height: 100%;
  width: 100px;
  position: relative;
  background: red;
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

  if (!data || data.length === 0 || error) return null;

  const {latitude, longitude} = data[0];
  const position: LatLngExpression = [latitude, longitude];

  return (
    <StyledMapDiv>
      <MapContainer style={{height: '100px'}} center={position} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributor'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ></TileLayer>
      </MapContainer>
    </StyledMapDiv>
  );
};

export default LocationVisualizer;
