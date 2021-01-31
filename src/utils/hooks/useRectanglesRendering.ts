import mapboxgl from 'mapbox-gl';
import { useEffect, useMemo, useState } from 'react';
import RectanglesTransformer from 'src/models/RectanglesTransformer';
import RectangleGeoJSON from 'src/models/RectangleGeoJSON';
import bbox from '@turf/bbox';
import Rectangle from 'src/models/Rectangle';
import {
  COLLISION_LINE_COLOR,
  COLLISION_LINE_STYLES,
  HAS_COLLISION_PROPERTY_NAME,
  MAP_COLLISION_LAYER_ID,
  MAP_FILL_LAYER_ID,
  MAP_SOURCE_ID,
} from '../config';

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

/**
 * Prepare the rectangles, renders them on the map and adjusts zoom.
 * Returns the loading indicator.
 * @param map the map instance
 * @param rectangles the source rectangles
 */
export default function useRectanglesRendering(
  map: mapboxgl.Map | null,
  rectangles: Rectangle[],
): boolean {
  const [rectanglesIsRendering, setRectanglesIsRendering] = useState(false);

  // Generate the feature collection for next rendering
  const featureCollection = useMemo(() => {
    const rectanglesGeoJSON = rectangles.map(
      (r) => new RectangleGeoJSON(r.data),
    );
    RectanglesTransformer.findAndRememberCollisions(rectanglesGeoJSON);
    return RectanglesTransformer.generateFeatureCollection(rectanglesGeoJSON);
  }, [rectangles]);

  // Render the rectangles and adjust zoom
  useEffect(() => {
    if (map && featureCollection?.features.length) {
      setRectanglesIsRendering(true);
      drawRectangles(map, featureCollection);
      adjustZoom(map, featureCollection);
    }
    setRectanglesIsRendering(false);
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
  }, [map, featureCollection]);

  return featureCollection && rectanglesIsRendering;
}
