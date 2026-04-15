import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stateCoordinates } from '@/data/indiaGeoJson';
import { stateTreeData, getForestColor } from '@/data/treeData';

interface IndiaMapProps {
  selectedState: string | null;
  onStateClick: (state: string) => void;
  densityRange: [number, number];
}

export default function IndiaMap({ selectedState, onStateClick, densityRange }: IndiaMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [22.5, 82],
      zoom: 5,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when filters/selection change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    stateCoordinates.forEach(coord => {
      const data = stateTreeData.find(s => s.state === coord.state);
      if (!data) return;
      if (data.treeDensity < densityRange[0] || data.treeDensity > densityRange[1]) return;

      const color = getForestColor(data.forestPercent);
      const isSelected = selectedState === coord.state;
      const radius = Math.max(8, Math.min(25, Math.log(data.totalAreaSqKm) * 2.5));

      const marker = L.circleMarker([coord.lat, coord.lng], {
        radius: isSelected ? radius + 5 : radius,
        color: isSelected ? '#1e293b' : color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: isSelected ? 3 : 1.5,
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-size:13px">
          <strong>${data.state}</strong><br/>
          Forest Cover: ${data.forestPercent}%<br/>
          Tree Density: ${data.treeDensity.toLocaleString()} /km²<br/>
          Trees: ${data.treeCount}M
        </div>`,
        { direction: 'top', sticky: true }
      );

      marker.on('click', () => onStateClick(coord.state));
      markersRef.current.push(marker);
    });
  }, [selectedState, densityRange, onStateClick]);

  // Fly to selected state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (selectedState) {
      const coord = stateCoordinates.find(s => s.state === selectedState);
      if (coord) map.flyTo([coord.lat, coord.lng], 7, { duration: 1 });
    } else {
      map.flyTo([22.5, 82], 5, { duration: 1 });
    }
  }, [selectedState]);

  return <div ref={containerRef} className="w-full h-[500px] rounded-lg z-0" />;
}
