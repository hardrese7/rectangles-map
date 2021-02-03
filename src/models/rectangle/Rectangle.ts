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

export default class Rectangle {
  constructor(
    public yaw_angle: number,
    public color: string,
    public center_lat: number,
    public center_lng: number,
    public length: number,
    public width: number,
  ) {
    mustBeNumber(center_lat, MIN_LATITUDE, MAX_LATITUDE);
    mustBeNumber(center_lng, MIN_LONGTITUDE, MAX_LONGTITUDE);
    mustBeNumber(length, MIN_RECTANGLE_LENGTH, MAX_RECTANGLE_LENGTH);
    mustBeNumber(width, MIN_RECTANGLE_WIDTH, MAX_RECTANGLE_WIDTH);
    mustBeNumber(yaw_angle, MIN_YAW_ANGLE, MAX_YAW_ANGLE);
    mustBeHexColor(color);
  }
}
