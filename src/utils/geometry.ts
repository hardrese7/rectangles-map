import { polygon, Position } from '@turf/helpers';
import transformRotate from '@turf/transform-rotate';
import computeDestinationPoint from 'geolib/es/computeDestinationPoint';

/**
 * Returns the angle in degrees between the opposite and adjacent sides
 * @param opposite The opposite side length
 * @param adjacent The adjacent side length
 */
export function calculateRightTriangleAngle(
  opposite: number,
  adjacent: number,
): number {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI;
}

/**
 * It's necessary to calculate coordinates because Mapbox
 * doesn't allow to draw the rectangles by the source data.
 * Returns the rectangle positions
 * (top-left, top-right, bottom-right, bottom-left, top-left)
 */
export function calculateRectangleCoordinates(
  center_lat: number,
  center_lng: number,
  length: number,
  width: number,
): Position[] {
  const halfLength = length / 2;
  const halfWidth = width / 2;
  const angleInDegrees = calculateRightTriangleAngle(halfWidth, halfLength);
  const distanceFromCenterToAngle = Math.hypot(halfWidth, halfLength);
  const rectCenter = {
    latitude: center_lat,
    longitude: center_lng,
  };

  const computePointPosition = (angle: number): Position => {
    const point = computeDestinationPoint(
      rectCenter,
      distanceFromCenterToAngle,
      angle,
    );
    return [point.longitude, point.latitude];
  };
  const hourAngle3h = 90;
  const hourAngle9h = 270;
  const topLeftPoint = computePointPosition(hourAngle9h + angleInDegrees);
  const topRightPoint = computePointPosition(hourAngle3h - angleInDegrees);
  const bottomRightPoint = computePointPosition(hourAngle3h + angleInDegrees);
  const bottomLeftPoint = computePointPosition(hourAngle9h - angleInDegrees);

  return [
    topLeftPoint,
    topRightPoint,
    bottomRightPoint,
    bottomLeftPoint,
    topLeftPoint,
  ];
}

export function getRotatedRectangle(
  rectangleCoordinates: Position[],
  center_lng: number,
  center_lat: number,
  yaw_angle: number,
): GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties> {
  const poly = polygon([rectangleCoordinates]);
  const options = {
    pivot: [center_lng, center_lat],
  };
  return transformRotate(poly, yaw_angle, options);
}
