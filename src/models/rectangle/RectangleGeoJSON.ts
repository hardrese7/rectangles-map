import RectanglesTransformer from 'src/models/rectangle/RectanglesTransformer';
import ShapeGeoJSON from 'src/models/shape/ShapeGeoJSON';
import IRectangleSource from './IRectangleSource';

export default class RectangleGeoJSON extends ShapeGeoJSON {
  constructor(rectangleSource: IRectangleSource) {
    const data = RectanglesTransformer.getRotatedRectangle(
      RectanglesTransformer.calculateRectangleCoordinates(rectangleSource),
      rectangleSource.center_lng,
      rectangleSource.center_lat,
      rectangleSource.yaw_angle,
    );
    data.properties = { color: rectangleSource.color };
    super(data);
  }
}
