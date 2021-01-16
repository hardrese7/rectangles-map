import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import Rectangle from 'Models/Rectangle';
import ISourceRectangle from 'Models/ISourceRectangle';
import {
  MAPBOX_KEY,
  MAP_SOURCE_ID,
  MAP_FILL_LAYER_ID,
  MAP_COLLISION_LAYER_ID,
} from 'Utils/config';
import {
  findCollisionsAndRemember,
  generateFeatureCollection,
} from 'Utils/helpers';
import LoadJSONButton from './LoadJSONButton';

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
    id: MAP_FILL_LAYER_ID,
    type: 'fill',
    source: MAP_SOURCE_ID,
    layout: {},
    paint: {
      'fill-color': ['get', 'color'],
    },
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
        ['boolean', ['has', 'hasCollision'], true],
        '#f00',
        'transparent',
      ],
      'line-width': 4,
      'line-offset': -3,
      'line-dasharray': [1, 1],
    },
  });
}

function adjustZoom(
  map: mapboxgl.Map,
  featureCollection: GeoJSON.FeatureCollection,
) {
  const bounds = bbox(featureCollection);
  map.fitBounds(
    new mapboxgl.LngLatBounds([bounds[0], bounds[1]], [bounds[2], bounds[3]]),
    {
      padding: 10,
      duration: 1000,
    },
  );
}

function TheMap(): JSX.Element {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);
  const updateRectangles = (newRectangles: ISourceRectangle[]) => {
    setRectangles(newRectangles.map((r) => new Rectangle(r)));
  };

  // Init the map instance
  useEffect(() => {
    let mapInstance: mapboxgl.Map | null;
    if (mapContainerRef && !map) {
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef?.current ?? '',
        style: 'mapbox://styles/mapbox/streets-v11',
      });
      setMap(mapInstance);
    }
    return () => {
      map?.remove();
      setMap(null);
    };
    // It's necessary to init the map only once, so let's disable linter rule react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render the rectangles and adjust zoom
  useEffect(() => {
    if (map && rectangles.length) {
      findCollisionsAndRemember(rectangles);
      const featureCollection = generateFeatureCollection(rectangles);
      drawRectangles(map, featureCollection);
      adjustZoom(map, featureCollection);
    }
    return () => {
      if (map?.getLayer(MAP_FILL_LAYER_ID)) {
        map?.removeLayer(MAP_FILL_LAYER_ID);
      }
      if (map?.getLayer(MAP_COLLISION_LAYER_ID)) {
        map?.removeLayer(MAP_COLLISION_LAYER_ID);
      }
      if (map?.getSource(MAP_SOURCE_ID)) {
        map?.removeSource(MAP_SOURCE_ID);
      }
    };
  }, [map, rectangles]);

  return (
    <div>
      <div ref={mapContainerRef} className="mapContainer" />
      <LoadJSONButton onJSONLoad={updateRectangles} />
    </div>
  );
}

export default TheMap;
