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
} from 'src/config';
import { mustBeHexColor, mustBeNumber } from 'src/utils/validators';

function specifyFieldInException(cb: () => unknown, fieldName: string) {
  try {
    cb();
  } catch (error) {
    error.message = `${fieldName} ${error.message}`;
    throw error;
  }
}

export default class Rectangle {
  constructor(
    public yaw_angle: number,
    public color: string,
    public center_lat: number,
    public center_lng: number,
    public length: number,
    public width: number,
  ) {
    specifyFieldInException(
      () => mustBeNumber(center_lat, MIN_LATITUDE, MAX_LATITUDE),
      'center_lat',
    );
    specifyFieldInException(
      () => mustBeNumber(center_lng, MIN_LONGTITUDE, MAX_LONGTITUDE),
      'center_lng',
    );
    specifyFieldInException(
      () => mustBeNumber(length, MIN_RECTANGLE_LENGTH, MAX_RECTANGLE_LENGTH),
      'length',
    );
    specifyFieldInException(
      () => mustBeNumber(width, MIN_RECTANGLE_WIDTH, MAX_RECTANGLE_WIDTH),
      'width',
    );
    specifyFieldInException(
      () => mustBeNumber(yaw_angle, MIN_YAW_ANGLE, MAX_YAW_ANGLE),
      'yaw_angle',
    );
    specifyFieldInException(() => mustBeHexColor(color), 'color');
  }
}
