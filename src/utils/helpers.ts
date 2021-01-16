import intersect from '@turf/intersect';
import Rectangle from 'Models/Rectangle';

export function findCollisionsAndRemember(rectangles: Rectangle[]): void {
  for (let i = 0; i < rectangles.length - 1; i += 1) {
    for (let j = i + 1; j < rectangles.length; j += 1) {
      const hasCollision = !!intersect(
        rectangles[i].geoJSON,
        rectangles[j].geoJSON,
      );
      if (hasCollision) {
        rectangles[i].setCollision(true);
        rectangles[j].setCollision(true);
      }
    }
  }
}

export function generateFeatureCollection(
  rectangles: Rectangle[],
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: rectangles.map((r) => r.geoJSON),
  };
}
