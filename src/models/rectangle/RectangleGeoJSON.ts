import ShapeGeoJSON from 'src/models/shape/ShapeGeoJSON';
import {
  calculateRectangleCoordinates,
  getRotatedRectangle,
} from 'src/utils/geometry';
import Rectangle from './Rectangle';

export default class RectangleGeoJSON extends ShapeGeoJSON {
  constructor({
    center_lng,
    center_lat,
    length,
    width,
    yaw_angle,
    color,
  }: Rectangle) {
    const data = getRotatedRectangle(
      calculateRectangleCoordinates(center_lat, center_lng, length, width),
      center_lng,
      center_lat,
      yaw_angle,
    );
    data.properties = { color };
    super(data);
  }
}
