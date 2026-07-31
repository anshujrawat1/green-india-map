import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { stateCoordinates } from '@/data/indiaGeoJson';
import { PlantationResult, getDeficitColor, fmt, fmtFull } from '@/lib/plantation';

interface Props {
  results: PlantationResult[];
  selected: string | null;
  onSelect: (state: string) => void;
}

/** Leaflet map coloured by tree deficit instead of forest cover. */
export default function DeficitMap({ results, selected, onSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center: [22.5, 82], zoom: 4, scrollWheelZoom: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    results.forEach(r => {
      const coord = stateCoordinates.find(c => c.state === r.region);
      if (!coord) return;
      const color = getDeficitColor(r.deficitPercent);
      const isSel = selected === r.region;
      const radius = Math.max(8, Math.min(26, Math.log10(Math.max(r.population, 10)) * 3.4));

      const marker = L.circleMarker([coord.lat, coord.lng], {
        radius: isSel ? radius + 5 : radius,
        color: isSel ? '#0f172a' : color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: isSel ? 3 : 1.5,
      }).addTo(map);

      marker.bindTooltip(
        `<div style="font-size:12px;line-height:1.5">
          <strong>${r.region}</strong><br/>
          Population: ${fmtFull(r.population)}<br/>
          Existing Trees: ${fmt(r.existingTrees)}<br/>
          Required Trees: ${fmt(r.requiredTrees)}<br/>
          Tree Deficit: ${fmt(r.treeDeficit)}<br/>
          Priority: ${r.priority} (${r.deficitPercent.toFixed(0)}%)
        </div>`,
        { direction: 'top', sticky: true }
      );
      marker.on('click', () => onSelect(r.region));
      markersRef.current.push(marker);
    });
  }, [results, selected, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const coord = selected ? stateCoordinates.find(c => c.state === selected) : null;
    if (coord) map.flyTo([coord.lat, coord.lng], 6, { duration: 1 });
  }, [selected]);

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="w-full h-[420px] rounded-lg z-0" />
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { c: '#065f46', l: 'Very Low Deficit' },
          { c: '#84cc16', l: 'Moderate' },
          { c: '#fbbf24', l: 'Medium' },
          { c: '#f97316', l: 'High' },
          { c: '#ef4444', l: 'Critical Deficit' },
        ].map(({ c, l }) => (
          <span key={l} className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: c }} />{l}
          </span>
        ))}
      </div>
    </div>
  );
}
