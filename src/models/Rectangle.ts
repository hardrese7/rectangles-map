import {
  MAX_LATITUDE,
  MAX_LONGTITUDE,
  MAX_RECTANGLE_LENGTH,
  MAX_RECTANGLE_WIDTH,
  MAX_YAW_ANGLE,
  MIN_LATITUDE,
  MIN_LONGTITUDE,
  MIN_RECTANGLE_LENGTH,
  MIN_RECTANGLE_WIDTH,
  MIN_YAW_ANGLE,
} from 'src/utils/config';
import {
  validateObjectPropertyIsColor,
  validateObjectPropertyIsNumber,
} from 'src/utils/validators';
import ISourceRectangle from './ISourceRectangle';
import Shape from './Shape';

export default class Rectangle extends Shape<ISourceRectangle> {
  // TODO May be in the future we'll need to replace it to
  // some library like https://www.npmjs.com/package/json2typescript
  /**
   * Throws an error if the shape is incorrect, otherwise returns true
   */
  validateShapeOfData(): boolean {
    validateObjectPropertyIsNumber(
      this.data,
      'center_lat',
      MIN_LATITUDE,
      MAX_LATITUDE,
    );
    validateObjectPropertyIsNumber(
      this.data,
      'center_lng',
      MIN_LONGTITUDE,
      MAX_LONGTITUDE,
    );
    validateObjectPropertyIsNumber(
      this.data,
      'length',
      MIN_RECTANGLE_LENGTH,
      MAX_RECTANGLE_LENGTH,
    );
    validateObjectPropertyIsNumber(
      this.data,
      'width',
      MIN_RECTANGLE_WIDTH,
      MAX_RECTANGLE_WIDTH,
    );
    validateObjectPropertyIsNumber(
      this.data,
      'yaw_angle',
      MIN_YAW_ANGLE,
      MAX_YAW_ANGLE,
    );
    validateObjectPropertyIsColor(this.data, 'color');
    return true;
  }
}
