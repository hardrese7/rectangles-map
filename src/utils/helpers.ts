import intersect from '@turf/intersect';
import Rectangle from '../models/Rectangle'; // TODO implement absolute imports

/* eslint-disable no-param-reassign */
export default function findCollisionsAndRemember(
  rectangles: Rectangle[],
): GeoJSON.FeatureCollection {
  for (let i = 0; i < rectangles.length - 1; i += 1) {
    for (let j = i + 1; j < rectangles.length; j += 1) {
      const hasCollision = !!intersect(
        rectangles[i].geoJSON,
        rectangles[j].geoJSON,
      );
      if (hasCollision) {
        if (!rectangles[i].geoJSON.properties) {
          rectangles[i].geoJSON.properties = {};
        }
        // TODO refactor
        rectangles[i].geoJSON.properties!.hasCollision = true;
        if (!rectangles[j].geoJSON.properties) {
          rectangles[j].geoJSON.properties = {};
        }
        rectangles[j].geoJSON.properties!.hasCollision = true;
      }
    }
  }
  return {
    type: 'FeatureCollection',
    features: rectangles.map((r) => r.geoJSON),
  };
}
/* eslint-enable no-param-reassign */
