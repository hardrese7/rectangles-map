import intersect from '@turf/intersect';
import ShapeGeoJSON from 'src/models/shape/ShapeGeoJSON';

export function findAndRememberCollisions(shapes: ShapeGeoJSON[]): void {
  for (let i = 0; i < shapes.length - 1; i += 1) {
    for (let j = i + 1; j < shapes.length; j += 1) {
      const hasCollision = !!intersect(shapes[i].data, shapes[j].data);
      if (hasCollision) {
        shapes[i].setCollision(true);
        shapes[j].setCollision(true);
      }
    }
  }
}

export function generateFeatureCollection(
  shapes: ShapeGeoJSON[],
): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: shapes.map((s) => s.data),
  };
}
