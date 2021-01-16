import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import bbox from '@turf/bbox';
import Rectangle from '../models/Rectangle'; // TODO implement absolute imports
import { MAPBOX_KEY } from '../utils/config'; // TODO implement absolute imports
import findCollisionsAndRemember from '../utils/helpers'; // TODO implement absolute imports
import LoadJSONButton from './LoadJSONButton';
import ISourceRectangle from '../models/ISourceRectangle'; // TODO implement absolute imports

mapboxgl.accessToken = MAPBOX_KEY;

function drawRectangle(map: mapboxgl.Map, rectangle: Rectangle, id: string) {
  map.addSource(id, {
    type: 'geojson',
    data: rectangle.geoJSON,
  });
  map.addLayer({
    id,
    type: 'fill',
    source: id,
    layout: {},
    paint: {
      'fill-color': rectangle.sourceData.color,
    },
  });
  if (rectangle.hasCollision) {
    map.addLayer({
      id: `line_${id}`,
      type: 'line',
      source: id,
      layout: {
        'line-cap': 'square',
        'line-join': 'miter',
      },
      paint: {
        'line-color': '#f00',
        'line-width': 4,
        'line-offset': -3,
        'line-dasharray': [1, 1],
      },
    });
  }
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
      findCollisionsAndRemember(rectangles);
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      rectangles.forEach((r, i) => {
        featureCollection.features.push(r.geoJSON);
        // TODO generate ids by nanoid
        drawRectangle(map, r, `rect${i}`);
      });
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
