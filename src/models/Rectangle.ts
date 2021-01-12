import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import transformRotate from '@turf/transform-rotate';
import { polygon, Position } from '@turf/helpers';
import ISourceRectangle from './ISourceRectangle';

function calcAngle(opposite: number, adjacent: number): number {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI;
}

export default class Rectangle {
  readonly sourceData: ISourceRectangle;

  readonly geoJSON: GeoJSON.Feature<GeoJSON.Geometry>;

  constructor(rectangle: ISourceRectangle) {
    this.sourceData = rectangle;
    this.geoJSON = this.getRotatedRectangle(
      this.calculateRectangleCoordinates(),
    );
  }

  getRotatedRectangle(
    rectangleCoordinates: Position[],
  ): GeoJSON.Feature<GeoJSON.Geometry> {
    const poly = polygon([rectangleCoordinates]);
    const options = {
      pivot: [this.sourceData.center_lng, this.sourceData.center_lat],
    };
    return transformRotate(poly, this.sourceData.yaw_angle, options);
  }

  // TODO refactor and make more clear
  calculateRectangleCoordinates(): Position[] {
    const halfLength = this.sourceData.length / 2;
    const halfWidth = this.sourceData.width / 2;
    const angle = calcAngle(halfWidth, halfLength);
    const distanceToAngle = Math.hypot(halfWidth, halfLength);
    const rectCenter = {
      latitude: this.sourceData.center_lat,
      longitude: this.sourceData.center_lng,
    };

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

    const startPoint = [topLeftAngle.longitude, topLeftAngle.latitude];
    return [
      startPoint,
      [topRightAngle.longitude, topRightAngle.latitude],
      [bottomRightAngle.longitude, bottomRightAngle.latitude],
      [bottomLeftAngle.longitude, bottomLeftAngle.latitude],
      startPoint,
    ];
  }
}
