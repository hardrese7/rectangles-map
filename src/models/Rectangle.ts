import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import transformRotate from '@turf/transform-rotate';
import { polygon, Position } from '@turf/helpers';
import { HAS_COLLISION_PROPERTY_NAME } from 'src/utils/config';
import { calculateRightTriangleAngle } from 'src/utils/helpers';
import ISourceRectangle from './ISourceRectangle';

export default class Rectangle {
  readonly sourceData: ISourceRectangle;

  readonly geoJSON: GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties>;

  constructor(rectangle: ISourceRectangle) {
    this.sourceData = rectangle;
    this.geoJSON = this.getRotatedRectangle(
      this.calculateRectangleCoordinates(),
    );
    this.geoJSON.properties = { color: this.sourceData.color };
  }

  getRotatedRectangle(
    rectangleCoordinates: Position[],
  ): GeoJSON.Feature<GeoJSON.Polygon, GeoJSON.GeoJsonProperties> {
    const poly = polygon([rectangleCoordinates]);
    const options = {
      pivot: [this.sourceData.center_lng, this.sourceData.center_lat],
    };
    return transformRotate(poly, this.sourceData.yaw_angle, options);
  }

  setCollision(value: boolean): void {
    if (!this.geoJSON.properties) {
      this.geoJSON.properties = {};
    }
    this.geoJSON.properties[HAS_COLLISION_PROPERTY_NAME] = value;
  }

  /**
   * It's necessary to calculate coordinates because Mapbox
   * doesn't allow to draw the rectangles by the source data.
   * Returns the rectangle positions
   * (top-left, top-right, bottom-right, bottom-left, top-left)
   */
  calculateRectangleCoordinates(): Position[] {
    const halfLength = this.sourceData.length / 2;
    const halfWidth = this.sourceData.width / 2;
    const angleInDegrees = calculateRightTriangleAngle(halfWidth, halfLength);
    const distanceFromCenterToAngle = Math.hypot(halfWidth, halfLength);
    const rectCenter = {
      latitude: this.sourceData.center_lat,
      longitude: this.sourceData.center_lng,
    };

    const computePointPosition = (angle: number): Position => {
      const point = computeDestinationPoint(
        rectCenter,
        distanceFromCenterToAngle,
        angle,
      );
      return [point.longitude, point.latitude];
    };

    const topLeftPoint = computePointPosition(360 - (90 - angleInDegrees));
    const topRightPoint = computePointPosition(90 - angleInDegrees);
    const bottomRightPoint = computePointPosition(90 + angleInDegrees);
    const bottomLeftPoint = computePointPosition(180 + (90 - angleInDegrees));

    return [
      topLeftPoint,
      topRightPoint,
      bottomRightPoint,
      bottomLeftPoint,
      topLeftPoint,
    ];
  }
}
