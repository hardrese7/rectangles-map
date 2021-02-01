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
import { propMustBeColor, propMustBeNumber } from 'src/utils/validators';
import Shape from 'src/models/shape/Shape';
import RectangleSource from './RectangleSource';

export default class Rectangle extends Shape<RectangleSource> {
  constructor(data: RectangleSource) {
    propMustBeNumber(data, 'center_lat', MIN_LATITUDE, MAX_LATITUDE);
    propMustBeNumber(data, 'center_lng', MIN_LONGTITUDE, MAX_LONGTITUDE);
    propMustBeNumber(
      data,
      'length',
      MIN_RECTANGLE_LENGTH,
      MAX_RECTANGLE_LENGTH,
    );
    propMustBeNumber(data, 'width', MIN_RECTANGLE_WIDTH, MAX_RECTANGLE_WIDTH);
    propMustBeNumber(data, 'yaw_angle', MIN_YAW_ANGLE, MAX_YAW_ANGLE);
    propMustBeColor(data, 'color');
    super(data);
  }
}
