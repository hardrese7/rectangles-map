import ShapeGeoJSON from 'src/models/shape/ShapeGeoJSON';
import {
  calculateRectangleCoordinates,
  getRotatedRectangle,
} from 'src/utils/rectanglesTransformers';
import IRectangleSource from './IRectangleSource';

export default class RectangleGeoJSON extends ShapeGeoJSON {
  constructor(rectangleSource: IRectangleSource) {
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
