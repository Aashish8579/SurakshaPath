// MapDisplay.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import type { RouteData, MapView } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  routeData: RouteData | null;
  mapView: MapView;
  setMapView: (view: MapView) => void;
}

// SVG Icons
const ICONS = {
  police_presence: `<svg viewBox="0 0 24 24" fill="white" style="width:18px;height:18px"><path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-2.01 13.84l-3.2-3.2 1.41-1.41 1.79 1.79 4.8-4.8 1.41 1.41-6.21 6.21z"/></svg>`,
  low_crime_zone: `<svg viewBox="0 0 24 24" fill="white" style="width:18px;height:18px"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
  well_lit: `<svg viewBox="0 0 24 24" fill="white" style="width:18px;height:18px"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM20 13h-2.07c-.12.72-.33 1.4-.61 2.04l1.52 1.52-1.41 1.41-1.52-1.52c-.64.28-1.32.49-2.04.61V20h-2v-2.07c-.72-.12-1.4-.33-2.04-.61l-1.52 1.52-1.41-1.41 1.52-1.52c-.28-.64-.49-1.32-.61-2.04H4v-2h2.07c.12-.72.33-1.4.61-2.04L5.16 7.44 6.57 6.03l1.52 1.52c.64-.28 1.32-.49 2.04-.61V5h2v2.07c.72.12 1.4.33 2.04.61l1.52-1.52 1.41 1.41-1.52 1.52c.28.64.49 1.32.61 2.04H20v2z"/></svg>`,
  pothole: `<svg viewBox="0 0 24 24" fill="white" style="width:18px;height:18px"><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm-2-6h2v5h-2v-5z"/></svg>`,
  damaged_road: `<svg viewBox="0 0 24 24" fill="white" style="width:18px;height:18px"><path d="M13.29 11.29L12 10l-1.29 1.29-1.42-1.42L10.59 9 9.29 7.71l1.42-1.42L12 7.59l1.29-1.29 1.42 1.42L13.41 9l1.29 1.29-1.42 1.42zM12 2L1 21h22L12 2z"/></svg>`,
};

// Create styled divIcon
const createMapIcon = (svgString: string, bgColor: string) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      ">
        ${svgString}
      </div>
    `,
    className: '', // remove default Leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Icon mapping
const iconMapping = {
  police_presence: createMapIcon(ICONS.police_presence, '#3b82f6'),
  low_crime_zone: createMapIcon(ICONS.low_crime_zone, '#22c55e'),
  well_lit: createMapIcon(ICONS.well_lit, '#facc15'),
  pothole: createMapIcon(ICONS.pothole, '#ef4444'),
  damaged_road: createMapIcon(ICONS.damaged_road, '#f97316'),
};

export const MapDisplay: React.FC<MapDisplayProps> = ({ routeData, mapView, setMapView }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: false,
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  const safetyMarkers = useMemo(
    () =>
      routeData?.safetyPoints.map(point =>
        L.marker([point.location.lat, point.location.lng], { icon: iconMapping[point.type] })
          .bindPopup(`<b>${point.type.replace(/_/g, ' ')}</b><br>${point.description}`)
      ) || [],
    [routeData]
  );

  const roadIssueMarkers = useMemo(
    () =>
      routeData?.roadIssues.map(issue =>
        L.marker([issue.location.lat, issue.location.lng], { icon: iconMapping[issue.type] })
          .bindPopup(`<b>${issue.type.replace(/_/g, ' ')} (${issue.severity})</b><br>${issue.description}`)
      ) || [],
    [routeData]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
    }

    if (routeData?.path.length) {
      const newLayer = L.layerGroup().addTo(map);
      routeLayerRef.current = newLayer;

      const latLngs = routeData.path.map(p => [p.lat, p.lng]);
      L.polyline(latLngs, { color: '#4f46e5', weight: 6, opacity: 0.8 }).addTo(newLayer);

      L.circleMarker(latLngs[0], { radius: 8, color: 'white', fillColor: '#10b981', fillOpacity: 1, weight: 2 }).addTo(newLayer).bindPopup('<b>Start</b>');
      L.circleMarker(latLngs[latLngs.length - 1], { radius: 8, color: 'white', fillColor: '#ef4444', fillOpacity: 1, weight: 2 }).addTo(newLayer).bindPopup('<b>End</b>');

      const markersToAdd = mapView === 'safety' ? safetyMarkers : roadIssueMarkers;
      markersToAdd.forEach(marker => marker.addTo(newLayer));

      const { southWest, northEast } = routeData.bounds;
      map.fitBounds(
        [
          [southWest.lat, southWest.lng],
          [northEast.lat, northEast.lng],
        ],
        { padding: [50, 50] }
      );
    } else {
      map.setView([20.5937, 78.9629], 5);
    }
  }, [routeData, mapView, safetyMarkers, roadIssueMarkers]);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 flex flex-col h-full w-full p-2">
      <div className="flex items-center justify-between mb-2 px-2 pt-1">
        <h2 className="text-lg font-bold text-white">Route Visualization</h2>
        <div className="flex p-1 bg-gray-900/70 rounded-lg">
          <button
            onClick={() => setMapView('safety')}
            className={`px-4 py-1 text-sm rounded-md transition-colors duration-200 font-semibold ${
              mapView === 'safety' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Safety
          </button>
          <button
            onClick={() => setMapView('roadCondition')}
            className={`px-4 py-1 text-sm rounded-md transition-colors duration-200 font-semibold ${
              mapView === 'roadCondition' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            Road Issues
          </button>
        </div>
      </div>
      <div ref={mapContainerRef} className="flex-grow w-full rounded-lg overflow-hidden relative">
        {!routeData && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-800/50 backdrop-blur-sm pointer-events-none">
            <div className="text-center">
              <p className="mt-2 text-lg font-semibold text-gray-400">Your route will appear here</p>
              <p className="text-sm text-gray-500">Enter a start and end point to begin.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
