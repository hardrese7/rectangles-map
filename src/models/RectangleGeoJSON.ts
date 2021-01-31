import RectanglesTransformer from './RectanglesTransformer';
import ISourceRectangle from './ISourceRectangle';
import ShapeGeoJSON from './ShapeGeoJSON';

export default class RectangleGeoJSON extends ShapeGeoJSON {
  constructor(sourceRectangle: ISourceRectangle) {
    const data = RectanglesTransformer.getRotatedRectangle(
      RectanglesTransformer.calculateRectangleCoordinates(sourceRectangle),
      sourceRectangle.center_lng,
      sourceRectangle.center_lat,
      sourceRectangle.yaw_angle,
    );
    data.properties = { color: sourceRectangle.color };
    super(data);
  }
}
