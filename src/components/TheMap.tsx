import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import transformRotate from '@turf/transform-rotate';
import { polygon } from '@turf/helpers';

// TODO move to config
const DEFAULT_MAP_SETTINGS = {
  lng: -122.486052,
  lat: 37.830348,
  zoom: 15,
};

// TODO move interface to the special folder
interface IRectangle {
  center_lat: number;
  center_lng: number;
  length: number;
  width: number;
  yaw_angle: number;
  color: string;
}
// TODO load rectangles from a file
const rectangles: IRectangle[] = [
  {
    center_lat: DEFAULT_MAP_SETTINGS.lat,
    center_lng: DEFAULT_MAP_SETTINGS.lng,
    length: 100,
    width: 100 * Math.sqrt(3),
    yaw_angle: 30,
    color: '#fff',
  },
  {
    center_lat: DEFAULT_MAP_SETTINGS.lat + 0.001,
    center_lng: DEFAULT_MAP_SETTINGS.lng,
    length: 100,
    width: 100 * Math.sqrt(3),
    yaw_angle: 30,
    color: '#f00',
  },
];

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFyZHJlc2U3IiwiYSI6ImNranNxc2h2OTA2ZTgyeXFzZmY5N3R0Z2gifQ.tkKZnAhtf0ZlA3lhD6j-cg'; // TODO move to config

function calcAngle(opposite: number, adjacent: number): number {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI;
}

// TODO refactor and make more clear
function calculateRectangleCoordinates(rectangle: IRectangle) {
  const halfLength = rectangle.length / 2;
  const halfWidth = rectangle.width / 2;
  const angle = calcAngle(halfWidth, halfLength);
  const rectCenter = {
    latitude: rectangle.center_lat,
    longitude: rectangle.center_lng,
  };
  const distanceToAngle = Math.hypot(halfWidth, halfLength);
  const topLeftAngle = computeDestinationPoint(
    rectCenter,
    distanceToAngle,
    360 - (90 - angle),
  );
  const topRightAngle = computeDestinationPoint(
    rectCenter,
    distanceToAngle,
    90 - angle,
  );
  const bottomRightAngle = computeDestinationPoint(
    rectCenter,
    distanceToAngle,
    90 + angle,
  );
  const bottomLeftAngle = computeDestinationPoint(
    rectCenter,
    distanceToAngle,
    180 + (90 - angle),
  );
  return [
    [topLeftAngle.longitude, topLeftAngle.latitude],
    [topRightAngle.longitude, topRightAngle.latitude],
    [bottomRightAngle.longitude, bottomRightAngle.latitude],
    [bottomLeftAngle.longitude, bottomLeftAngle.latitude],
    [topLeftAngle.longitude, topLeftAngle.latitude],
  ];
}

function drawRectangle(map: mapboxgl.Map, rectangle: IRectangle, id: string) {
  const rectCoords = calculateRectangleCoordinates(rectangle);
  const poly = polygon([rectCoords]);
  const options = { pivot: [rectangle.center_lng, rectangle.center_lat] };
  const rotatedPoly = transformRotate(poly, rectangle.yaw_angle, options);
  map.addSource(id, {
    type: 'geojson',
    data: rotatedPoly,
  });
  map.addLayer({
    id,
    type: 'fill',
    source: id,
    layout: {},
    paint: {
      'fill-color': rectangle.color,
    },
  });
}

function TheMap(): JSX.Element {
  const [, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);
  useEffect(() => {
    if (!mapContainerRef) {
      return;
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef?.current ?? '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [DEFAULT_MAP_SETTINGS.lng, DEFAULT_MAP_SETTINGS.lat],
      zoom: DEFAULT_MAP_SETTINGS.zoom,
    });
    map.on('load', () => {
      // TODO check and mark collisions
      // TODO generate ids by nanoid
      rectangles.forEach((r, i) => drawRectangle(map, r, `rect${i}`));
    });
    setMap(map);
    // TODO clear memory
  }, [mapContainerRef]);
  return (
    <div>
      <div ref={mapContainerRef} className="mapContainer" />
    </div>
  );
}

export default TheMap;
