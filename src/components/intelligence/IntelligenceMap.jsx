import React, { useRef, useEffect, useState, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Shield, Info, Map as MapIcon, RotateCcw, AlertTriangle, Maximize2, Minimize2 } from "lucide-react";

import { buildMapGeoJSON } from "../../utils/intelligenceMapping";

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

const THREAT_COLORS = {
  malicious: "#ef4444",
  suspicious: "#f97316",
  clean: "#22c55e",
  unavailable: "#94a3b8",
  unknown: "#6b7280",
};

export default function IntelligenceMap({ geoPoints = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Need to trigger map resize after DOM updates
    setTimeout(() => {
      if (mapRef.current) mapRef.current.resize();
    }, 100);
  };

  const geoJsonData = useMemo(() => buildMapGeoJSON(geoPoints), [geoPoints]);
  const validPointsCount = geoJsonData.features.length;

  useEffect(() => {
    if (validPointsCount === 0 || mapError) return;
    if (mapRef.current) return; // Initialize map only once

    let resizeObserver = null;

    try {
      if (!MAPTILER_KEY) {
        console.error("VITE_MAPTILER_API_KEY is missing from import.meta.env. Please ensure it is in .env.local and restart Vite.");
        setMapError(true);
        return;
      }

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${MAPTILER_KEY}`,
        center: [0, 20],
        zoom: 1.5,
        attributionControl: false,
      });
      
      mapRef.current = map;

      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) mapRef.current.resize();
      });
      if (mapContainer.current) {
        resizeObserver.observe(mapContainer.current);
      }

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
      map.addControl(new maplibregl.AttributionControl({ customAttribution: 'MapTiler' }), 'bottom-left');

      map.on('error', (e) => {
        console.error("MapLibre error:", e);
        // MapTiler is returning 403 Key Usage Restricted, which sometimes manifests as generic fetch errors
        // We must aggressively fallback to prevent the blank black rectangle
        setMapError(true);
      });

      map.on('load', () => {
        setTimeout(() => {
          if (mapRef.current) mapRef.current.resize();
        }, 100);

        map.addSource('locations', {
          type: 'geojson',
          data: geoJsonData,
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });

        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'locations',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#3b82f6',
            'circle-radius': ['step', ['get', 'point_count'], 15, 10, 22, 50, 30],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#1e293b',
          },
        });

        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'locations',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#ffffff',
          },
        });

        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'locations',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': [
              'match',
              ['get', 'threat'],
              'malicious', THREAT_COLORS.malicious,
              'suspicious', THREAT_COLORS.suspicious,
              'clean', THREAT_COLORS.clean,
              'unavailable', THREAT_COLORS.unavailable,
              THREAT_COLORS.unknown
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });

        // Add a real DOM marker for single points to ensure high visibility
        if (validPointsCount === 1) {
           const p = geoJsonData.features[0];
           const coords = p.geometry.coordinates;
           const threatColor = THREAT_COLORS[p.properties.threat] || THREAT_COLORS.unknown;
           new maplibregl.Marker({ color: threatColor })
             .setLngLat(coords)
             .addTo(map);
        }

        // Click on cluster
        map.on('click', 'clusters', (e) => {
          const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
          const clusterId = features[0].properties.cluster_id;
          const pointCount = features[0].properties.point_count;
          
          map.getSource('locations').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            
            // Show popup before zooming
            const coordinates = features[0].geometry.coordinates.slice();
            const popupHtml = `
              <div class="p-2 min-w-[150px] text-gray-900">
                <div class="font-bold text-sm mb-1">${pointCount} public IP indicators</div>
                <button id="zoom-cluster-btn" class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded">
                  Zoom to locations
                </button>
              </div>
            `;
            
            const popup = new maplibregl.Popup({ className: 'custom-popup', closeButton: true })
              .setLngLat(coordinates)
              .setHTML(popupHtml)
              .addTo(map);

            document.getElementById('zoom-cluster-btn').addEventListener('click', () => {
              popup.remove();
              map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom + 1 });
            });
          });
        });

        // Click on individual point
        map.on('click', 'unclustered-point', (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const props = e.features[0].properties;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          const locationText = [props.city, props.country].filter(Boolean).join(", ");
          const threatColor = THREAT_COLORS[props.threat] || THREAT_COLORS.unknown;

          const popupHtml = `
            <div class="p-1 min-w-[200px] text-gray-900">
              <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                <div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${threatColor}"></div>
                <span class="font-mono text-sm font-bold">${props.ip}</span>
              </div>
              <div class="space-y-1.5 text-xs text-gray-600">
                ${locationText ? `<div class="font-medium text-gray-800">📍 ${locationText}</div>` : ''}
                ${props.asn ? `<div>ASN: <span class="text-gray-800">${props.asn}</span></div>` : ''}
                ${props.isp ? `<div class="truncate" title="${props.isp}">ISP: <span class="text-gray-800">${props.isp}</span></div>` : ''}
              </div>
              <div class="mt-3 pt-2 border-t border-gray-200 text-xs font-bold">
                Threat: <span style="color: ${threatColor}" class="capitalize">${props.threat}</span>
              </div>
            </div>
          `;

          new maplibregl.Popup({ className: 'custom-popup' })
            .setLngLat(coordinates)
            .setHTML(popupHtml)
            .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
        map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });

        fitLocations();
      });
      
    } catch (err) {
      console.error("Map initialization failed", err);
      setMapError(true);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [MAPTILER_KEY, validPointsCount]);

  // Update data if it changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.isStyleLoaded()) {
      const source = mapRef.current.getSource('locations');
      if (source) {
        source.setData(geoJsonData);
      }
    }
  }, [geoJsonData]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fitLocations = () => {
    if (!mapRef.current || validPointsCount === 0) return;
    
    if (validPointsCount === 1) {
      const p = geoJsonData.features[0].geometry.coordinates;
      mapRef.current.flyTo({
        center: p,
        zoom: 8,
        essential: true
      });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    geoJsonData.features.forEach(f => {
      bounds.extend(f.geometry.coordinates);
    });
    
    mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
  };

  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [0, 20], zoom: 1.5, essential: true });
    }
  };

  // Render Empty States First
  if (mapError) {
    const locPoint = geoPoints[0] || {};
    const locText = [locPoint.city, locPoint.country].filter(Boolean).join(", ");
    
    return (
      <div className="w-full min-h-[420px] rounded-2xl overflow-hidden border border-border bg-[#0d1117] flex flex-col items-center justify-center relative">
        <div className="text-center bg-secondary/80 rounded-xl px-8 py-6 border border-border max-w-md mx-4 space-y-3">
          <MapIcon className="w-10 h-10 text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-lg font-bold text-primary">Map unavailable</h3>
          {locText && (
            <p className="text-sm text-secondary font-medium">
              Location data is available: <span className="text-primary font-semibold">{locText}</span>
            </p>
          )}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted pt-2 border-t border-border mt-3">
            <AlertTriangle size={12} />
            <span>IP geolocation is approximate.</span>
          </div>
        </div>
      </div>
    );
  }

  if (geoPoints.length === 0) {
    return (
      <div className="w-full min-h-[420px] rounded-2xl overflow-hidden border border-border bg-[#0d1117] flex flex-col items-center justify-center relative">
        <div className="text-center bg-secondary/80 rounded-xl px-6 py-5 border border-border max-w-sm mx-4">
          <Shield className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-sm text-secondary font-medium">No public IP locations to display.</p>
        </div>
      </div>
    );
  }

  if (validPointsCount === 0) {
    return (
      <div className="w-full min-h-[420px] rounded-2xl overflow-hidden border border-border bg-[#0d1117] flex flex-col items-center justify-center relative">
        <div className="text-center bg-secondary/80 rounded-xl px-6 py-5 border border-border max-w-sm mx-4">
          <Info className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-sm text-secondary font-medium">Location unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-border bg-[#0d1117] ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl h-[calc(100vh-2rem)]' : 'h-full min-h-[250px]'}`}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/50 bg-background/50 z-10 absolute top-0 left-0 right-0">
        <Info className="w-4 h-4 text-secondary flex-shrink-0" />
        <span className="text-xs text-secondary font-medium truncate">
          Approximate IP location — IP geolocation is not precise and does not imply device location
        </span>
      </div>

      <div ref={mapContainer} className="absolute inset-0 z-0" />
      
      <div className="absolute top-16 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={toggleFullscreen}
          className="bg-secondary/90 border border-border p-2.5 rounded-md text-secondary hover:text-primary hover:bg-interactive transition-colors shadow-lg"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
        <button 
          onClick={fitLocations}
          className="bg-secondary/90 border border-border p-2.5 rounded-md text-secondary hover:text-primary hover:bg-interactive transition-colors shadow-lg"
          title="Fit Locations"
        >
          <MapIcon size={16} />
        </button>
        <button 
          onClick={resetView}
          className="bg-secondary/90 border border-border p-2.5 rounded-md text-secondary hover:text-primary hover:bg-interactive transition-colors shadow-lg"
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-4 px-5 py-2.5 border-t border-border/50 bg-secondary/90 z-10">
        {Object.entries(THREAT_COLORS).map(([threat, color]) => (
          <div key={threat} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-secondary capitalize font-medium">{threat}</span>
          </div>
        ))}
        <span className="text-[11px] text-muted font-medium ml-auto bg-secondary/80 px-2 py-0.5 rounded border border-border">
          {validPointsCount} IP{validPointsCount !== 1 ? "s" : ""} shown
        </span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-popup .maplibregl-popup-content {
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 8px 12px;
        }
        .custom-popup .maplibregl-popup-close-button {
          font-size: 16px;
          color: #6b7280;
          padding: 4px;
        }
        .custom-popup .maplibregl-popup-close-button:hover {
          color: #111827;
          background: transparent;
        }
      `}} />
    </div>
  );
}
