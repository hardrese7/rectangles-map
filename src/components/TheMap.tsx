import React, { useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import Rectangle from 'src/models/rectangle/Rectangle';
import { MAPBOX_KEY } from 'src/config';
import useMap from 'src/hooks/useMap';
import useRectanglesRendering from 'src/hooks/useRectanglesRendering';
import styles from './TheMap.module.css';
import RectanglesLoader from './RectanglesLoader';
import Spinner from './Spinner';

/* eslint-disable */
// IMPORTANT: we need this workaround to fix the build
// more details here: https://github.com/mapbox/mapbox-gl-js/issues/10173#issuecomment-750489778
// TODO when there will be some better solution, remove this workaround
// @ts-ignore
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
/* eslint-enable */

mapboxgl.accessToken = MAPBOX_KEY;

function TheMap(): JSX.Element {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [mapContainerRef, map, mapIsLoading] = useMap();
  const rectanglesIsRendering = useRectanglesRendering(map, rectangles);
  const [rectanglesIsLoading, setRectanglesIsLoading] = useState(false);

  const appIsLoading = useMemo(
    () => rectanglesIsLoading || mapIsLoading || rectanglesIsRendering,
    [rectanglesIsLoading, mapIsLoading, rectanglesIsRendering],
  );

  const finishRectanglesLoading = (loadedRectangles: Rectangle[]): void => {
    setRectangles(loadedRectangles);
    setRectanglesIsLoading(false);
  };

  return (
    <div>
      <div ref={mapContainerRef} className={styles.mapContainer} />
      <RectanglesLoader
        disabled={appIsLoading}
        onSuccess={finishRectanglesLoading}
        onError={() => setRectanglesIsLoading(false)}
        onLoadingStart={() => setRectanglesIsLoading(true)}
      />
      {appIsLoading && <Spinner />}
    </div>
  );
}

export default TheMap;
