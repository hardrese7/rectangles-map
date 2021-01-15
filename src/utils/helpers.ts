import intersect from '@turf/intersect';
import Rectangle from '../models/Rectangle'; // TODO implement absolute imports

/* eslint-disable no-param-reassign */
export default function findCollisionsAndRemember(
  rectangles: Rectangle[],
): void {
  for (let i = 0; i < rectangles.length - 1; i += 1) {
    for (let j = i + 1; j < rectangles.length; j += 1) {
      const hasCollision = !!intersect(
        rectangles[i].geoJSON,
        rectangles[j].geoJSON,
      );
      if (hasCollision) {
        rectangles[i].hasCollision = true;
        rectangles[j].hasCollision = true;
      }
    }
  }
}
/* eslint-enable no-param-reassign */
