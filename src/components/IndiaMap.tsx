import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stateCoordinates } from '@/data/indiaGeoJson';
import { getForestColor } from '@/data/treeData';
import { PRIORITY_META } from '@/lib/plantation';
import { ColorMode } from '@/components/Filters';
import { StateRow } from '@/components/StateList';
import { Maximize2 } from 'lucide-react';

interface IndiaMapProps {
  rows: StateRow[];
  selectedState: string | null;
  hoveredState: string | null;
  colorMode: ColorMode;
  onStateClick: (state: string | null) => void;
  onStateHover: (state: string | null) => void;
}

const densityColor = (d: number) =>
  d > 30000 ? '#065f46' : d > 15000 ? '#059669' : d > 7000 ? '#34d399' : d > 2000 ? '#fbbf24' : '#ef4444';

export default function IndiaMap({ rows, selectedState, hoveredState, colorMode, onStateClick, onStateHover }: IndiaMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: [22.5, 82], zoom: 5, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Draw markers for the currently filtered states
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    rows.forEach(({ data, metrics }) => {
      const coord = stateCoordinates.find(c => c.state === data.state);
      if (!coord) return;

      const color =
        colorMode === 'density' ? densityColor(data.treeDensity)
        : colorMode === 'priority' && metrics ? PRIORITY_META[metrics.priority].color
        : getForestColor(data.forestPercent);

      const radius = Math.max(8, Math.min(25, Math.log(data.totalAreaSqKm) * 2.5));

      const marker = L.circleMarker([coord.lat, coord.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 1.5,
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-size:13px">
          <strong>${data.state}</strong><br/>
          Forest Cover: ${data.forestPercent}%<br/>
          Tree Density: ${data.treeDensity.toLocaleString()} /km²<br/>
          Trees: ${data.treeCount}M${metrics ? `<br/>Priority: ${metrics.priority}` : ''}
        </div>`,
        { direction: 'top', sticky: true }
      );

      marker.on('click', () => onStateClick(data.state));
      marker.on('mouseover', () => onStateHover(data.state));
      marker.on('mouseout', () => onStateHover(null));
      markersRef.current[data.state] = marker;
    });
  }, [rows, colorMode, onStateClick, onStateHover]);

  // Highlight selection / hover without redrawing everything
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([state, marker]) => {
      const base = Math.max(8, Math.min(25, marker.options.radius ?? 10));
      const active = state === selectedState;
      const hover = state === hoveredState;
      marker.setStyle({
        weight: active ? 3.5 : hover ? 2.5 : 1.5,
        color: active ? '#1e293b' : hover ? '#0f172a' : (marker.options.fillColor as string),
        fillOpacity: active || hover ? 0.95 : 0.6,
      });
      marker.setRadius(active ? base + 6 : hover ? base + 3 : base);
      if (active || hover) marker.bringToFront();
    });
  }, [selectedState, hoveredState, rows, colorMode]);

  // Fly to selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const coord = selectedState ? stateCoordinates.find(s => s.state === selectedState) : null;
    if (coord) map.flyTo([coord.lat, coord.lng], 7, { duration: 1 });
    else map.flyTo([22.5, 82], 5, { duration: 1 });
  }, [selectedState]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[500px] rounded-lg z-0" />
      <button
        onClick={() => { onStateClick(null); mapRef.current?.flyTo([22.5, 82], 5, { duration: 0.8 }); }}
        className="absolute top-3 right-3 z-[400] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-card/90 backdrop-blur-sm border border-border text-xs font-medium text-foreground shadow-sm hover:bg-card transition-colors"
      >
        <Maximize2 className="h-3.5 w-3.5" /> Reset view
      </button>
    </div>
  );
}
