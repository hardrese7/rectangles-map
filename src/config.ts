export const MIN_LATITUDE = -90;
export const MAX_LATITUDE = 90;
export const MIN_LONGTITUDE = -180;
export const MAX_LONGTITUDE = 180;
export const MIN_RECTANGLE_LENGTH = 1;
export const MAX_RECTANGLE_LENGTH = 100;
export const MIN_RECTANGLE_WIDTH = 1;
export const MAX_RECTANGLE_WIDTH = 100;
export const MIN_YAW_ANGLE = -360;
export const MAX_YAW_ANGLE = 360;

// TODO move the key from the repository to the environment variables
export const MAPBOX_KEY =
  'pk.eyJ1IjoiaGFyZHJlc2U3IiwiYSI6ImNranNxc2h2OTA2ZTgyeXFzZmY5N3R0Z2gifQ.tkKZnAhtf0ZlA3lhD6j-cg';

export const MAP_SOURCE_ID = 'rectangles';
export const MAP_COLLISION_LAYER_ID = `${MAP_SOURCE_ID}_collision`;
export const MAP_FILL_LAYER_ID = `${MAP_SOURCE_ID}_fill`;
export const HAS_COLLISION_PROPERTY_NAME = 'hasCollision';

export const MAPBOX_MAP_STYLE = 'mapbox://styles/mapbox/streets-v11';
export const COLLISION_LINE_COLOR = '#f00';
export const COLLISION_LINE_STYLES = {
  'line-width': 4,
  'line-offset': -3,
  'line-dasharray': [1, 1],
};

export const EMPTY_FILE_ERROR_TEXT = 'The provided file is empty';
export const NO_FILE_ERROR_TEXT = 'You should to choose one correct JSON file';
export const MAPBOX_ERROR_TEXT =
  'Something wrong happened with the map module, please try to reload this page';
