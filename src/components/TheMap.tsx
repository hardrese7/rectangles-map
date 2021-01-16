import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import Rectangle from 'Models/Rectangle';
import ISourceRectangle from 'Models/ISourceRectangle';
import { MAPBOX_KEY } from 'Utils/config';
import findCollisionsAndRemember from 'Utils/helpers';
import LoadJSONButton from './LoadJSONButton';

mapboxgl.accessToken = MAPBOX_KEY;

function drawRectangles(
  map: mapboxgl.Map,
  featureCollection: GeoJSON.FeatureCollection,
) {
  const id = 'rectangles';
  map.addSource(id, {
    type: 'geojson',
    data: featureCollection,
  });
  map.addLayer({
    id,
    type: 'fill',
    source: id,
    layout: {},
    paint: {
      'fill-color': ['get', 'color'],
    },
  });
  map.addLayer({
    id: `line_${id}`,
    type: 'line',
    source: id,
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
  const [, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);
  const updateRectangles = (newRectangles: ISourceRectangle[]) => {
    setRectangles(newRectangles.map((r) => new Rectangle(r)));
  };
  useEffect(() => {
    // TODO implement spinner or disable button
    if (!mapContainerRef) {
      return;
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef?.current ?? '',
      style: 'mapbox://styles/mapbox/streets-v11',
    });
    // TODO research may be there is an ability to not reload the map on the rectangles loading
    map.on('load', () => {
      if (!rectangles.length) {
        return;
      }
      const featureCollection: GeoJSON.FeatureCollection = findCollisionsAndRemember(
        rectangles,
      );
      drawRectangles(map, featureCollection);
      adjustZoom(map, featureCollection);
    });
    setMap(map);
    // TODO clear memory
  }, [mapContainerRef, rectangles]);
  return (
    <div>
      <div ref={mapContainerRef} className="mapContainer" />
      <LoadJSONButton onJSONLoad={updateRectangles} />
    </div>
  );
}

export default TheMap;
