import { polygon, Position } from '@turf/helpers';
import transformRotate from '@turf/transform-rotate';
import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import { calculateRightTriangleAngle } from 'src/utils/helpers';
import ShapesTransformer from 'src/models/shape/ShapesTransformer';
import IRectangleDimesions from './IRectangleDimesions';
import IRectangleSource from './IRectangleSource';

export default class RectanglesTransformer extends ShapesTransformer {
  /**
   * It's necessary to calculate coordinates because Mapbox
   * doesn't allow to draw the rectangles by the source data.
   * Returns the rectangle positions
   * (top-left, top-right, bottom-right, bottom-left, top-left)
   */
  static calculateRectangleCoordinates(data: IRectangleDimesions): Position[] {
    const halfLength = data.length / 2;
    const halfWidth = data.width / 2;
    const angleInDegrees = calculateRightTriangleAngle(halfWidth, halfLength);
    const distanceFromCenterToAngle = Math.hypot(halfWidth, halfLength);
    const rectCenter = {
      latitude: data.center_lat,
      longitude: data.center_lng,
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

  static getRotatedRectangle(
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

  static sourceToGeoJSON(
    rectangleSource: IRectangleSource,
  ): GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties> {
    const geoJSON = RectanglesTransformer.getRotatedRectangle(
      RectanglesTransformer.calculateRectangleCoordinates(rectangleSource),
      rectangleSource.center_lng,
      rectangleSource.center_lat,
      rectangleSource.yaw_angle,
    );
    geoJSON.properties = { color: rectangleSource.color };
    return geoJSON;
  }
}
