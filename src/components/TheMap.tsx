import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiaGFyZHJlc2U3IiwiYSI6ImNranNxc2h2OTA2ZTgyeXFzZmY5N3R0Z2gifQ.tkKZnAhtf0ZlA3lhD6j-cg'; // TODO move to config
const DEFAULT_MAP_SETTINGS = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

function TheMap(): JSX.Element {
  const [, setMap] = useState<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);
  useEffect(() => {
    if (!mapContainerRef) {
      return;
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef?.current ?? '',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [DEFAULT_MAP_SETTINGS.lng, DEFAULT_MAP_SETTINGS.lat],
      zoom: DEFAULT_MAP_SETTINGS.zoom,
    });
    setMap(map);
    // TODO clear memory
  }, [mapContainerRef]);
  return (
    <div>
      <div ref={mapContainerRef} className="mapContainer" />
    </div>
  );
}

export default TheMap;
