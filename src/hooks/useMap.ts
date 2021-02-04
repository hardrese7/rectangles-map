import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import { MAPBOX_ERROR_TEXT, MAPBOX_MAP_STYLE } from 'src/config';
import showError from 'src/utils/showError';

/**
 * Initializes the map.
 * Returns mapRef, the map instance, and the loading indicator
 */
export default function useMap(): [
  React.MutableRefObject<null>,
  mapboxgl.Map | null,
  boolean,
] {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapIsLoading, setMapIsLoading] = useState(true);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef && (!map || !map.loaded())) {
      setMapIsLoading(true);
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef?.current ?? '',
        style: MAPBOX_MAP_STYLE,
      });
      mapInstance.on('load', () => {
        setMap(mapInstance);
        setMapIsLoading(false);
      });
      mapInstance.on('error', () => {
        showError(MAPBOX_ERROR_TEXT);
        setMapIsLoading(false);
      });
    }
    return () => {
      if (map && map.loaded()) {
        map.remove();
      }
    };
  }, [map]);

  return [mapContainerRef, map, mapIsLoading];
}
