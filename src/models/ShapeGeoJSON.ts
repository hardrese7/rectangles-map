import { HAS_COLLISION_PROPERTY_NAME } from 'src/utils/config';

export default abstract class ShapeGeoJSON {
  constructor(
    public readonly data: GeoJSON.Feature<
      GeoJSON.Polygon,
      GeoJSON.GeoJsonProperties
    >,
  ) {}

  setCollision(value: boolean): void {
    if (!this.data.properties) {
      this.data.properties = {};
    }
    this.data.properties[HAS_COLLISION_PROPERTY_NAME] = value;
  }
}
