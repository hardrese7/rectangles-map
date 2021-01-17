import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import Rectangle from 'src/models/Rectangle';
import {
  MAPBOX_KEY,
  MAP_SOURCE_ID,
  MAP_FILL_LAYER_ID,
  MAP_COLLISION_LAYER_ID,
  HAS_COLLISION_PROPERTY_NAME,
  COLLISION_LINE_COLOR,
  COLLISION_LINE_STYLES,
  MAPBOX_ERROR_TEXT,
  MAPBOX_MAP_STYLE,
} from 'src/utils/config';
import {
  findCollisionsAndRemember,
  generateFeatureCollection,
  showError,
} from 'src/utils/helpers';
import styles from './TheMap.module.css';
import RectanglesLoader from './RectanglesLoader';
import Spinner from './Spinner';

/* eslint-disable */
// IMPORTANT: we need this workaround to fix the build
// more details here: https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// TODO when there will be some better solution, remove this workaround
// @ts-ignore
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
/* eslint-enable */

mapboxgl.accessToken = MAPBOX_KEY;

function drawRectangles(
  map: mapboxgl.Map,
  featureCollection: GeoJSON.FeatureCollection,
) {
  map.addSource(MAP_SOURCE_ID, {
    type: 'geojson',
    data: featureCollection,
  });

  map.addLayer({
    id: MAP_COLLISION_LAYER_ID,
    type: 'line',
    source: MAP_SOURCE_ID,
    layout: {
      'line-cap': 'square',
      'line-join': 'miter',
    },
    paint: {
      'line-color': [
        'case',
        ['boolean', ['has', HAS_COLLISION_PROPERTY_NAME], true],
        COLLISION_LINE_COLOR,
        'transparent',
      ],
      ...COLLISION_LINE_STYLES,
    },
  });

  map.addLayer({
    id: MAP_FILL_LAYER_ID,
    type: 'fill',
    source: MAP_SOURCE_ID,
    layout: {},
    paint: {
      'fill-color': ['get', 'color'],
      'fill-outline-color': 'transparent',
    },
  });
}

function adjustZoom(
  map: mapboxgl.Map,
  featureCollection: GeoJSON.FeatureCollection,
) {
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);
  map.fitBounds(new mapboxgl.LngLatBounds([minLng, minLat], [maxLng, maxLat]), {
    padding: 10,
    duration: 1000,
  });
}

function TheMap(): JSX.Element {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const mapContainerRef = useRef(null);

  // Init the map instance
  useEffect(() => {
    if (mapContainerRef && (!map || !map.loaded())) {
      setLoading(true);
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef?.current ?? '',
        style: MAPBOX_MAP_STYLE,
      });
      mapInstance.on('load', () => {
        setMap(mapInstance);
      });
      mapInstance.on('error', () => {
        showError(MAPBOX_ERROR_TEXT);
      });
    }
    return () => {
      if (map && map.loaded()) {
        map.remove();
      }
    };
  }, [map]);

  // Render the rectangles and adjust zoom
  useEffect(() => {
    if (map && rectangles.length) {
      setLoading(true);
      findCollisionsAndRemember(rectangles);
      const featureCollection = generateFeatureCollection(rectangles);
      drawRectangles(map, featureCollection);
      adjustZoom(map, featureCollection);
    }
    setLoading(false);
    return () => {
      if (!map || !map.loaded()) {
        return;
      }
      if (map.getLayer(MAP_FILL_LAYER_ID)) {
        map.removeLayer(MAP_FILL_LAYER_ID);
      }
      if (map.getLayer(MAP_COLLISION_LAYER_ID)) {
        map.removeLayer(MAP_COLLISION_LAYER_ID);
      }
      if (map.getSource(MAP_SOURCE_ID)) {
        map.removeSource(MAP_SOURCE_ID);
      }
    };
  }, [map, rectangles]);

  return (
    <div>
      <div ref={mapContainerRef} className={styles.mapContainer} />
      <RectanglesLoader
        disabled={loading}
        onSuccess={setRectangles}
        onError={() => setLoading(false)}
        onLoadingStart={() => setLoading(true)}
      />
      {loading && <Spinner />}
    </div>
  );
}

export default TheMap;
