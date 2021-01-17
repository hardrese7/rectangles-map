export const DEFAULT_MAP_SETTINGS = {
  lng: -122.486052,
  lat: 37.830348,
  zoom: 15,
};

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

export const NO_FILE_ERROR_TEXT = 'You should to choose one correct JSON file';
export const INVALID_JSON_ERROR_TEXT = 'Invalid JSON! Check the JSON format';
export const MAPBOX_ERROR_TEXT =
  'Something wrong happened with the map module, please try to reload this page';
