import ShapeGeoJSON from 'src/models/shape/ShapeGeoJSON';
import {
  calculateRectangleCoordinates,
  getRotatedRectangle,
} from 'src/utils/rectanglesTransformers';
import RectangleSource from './RectangleSource';

export default class RectangleGeoJSON extends ShapeGeoJSON {
  constructor(rectangleSource: RectangleSource) {
    const data = getRotatedRectangle(
      calculateRectangleCoordinates(rectangleSource),
      rectangleSource.center_lng,
      rectangleSource.center_lat,
      rectangleSource.yaw_angle,
    );
    data.properties = { color: rectangleSource.color };
    super(data);
  }
}
