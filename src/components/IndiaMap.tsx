import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stateCoordinates } from '@/data/indiaGeoJson';
import { stateTreeData, getForestColor } from '@/data/treeData';

/** Recenter map when selected state changes */
function MapController({ selectedState }: { selectedState: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedState) {
      const coord = stateCoordinates.find(s => s.state === selectedState);
      if (coord) map.flyTo([coord.lat, coord.lng], 7, { duration: 1 });
    } else {
      map.flyTo([22.5, 82], 5, { duration: 1 });
    }
  }, [selectedState, map]);
  return null;
}

interface IndiaMapProps {
  selectedState: string | null;
  onStateClick: (state: string) => void;
  densityRange: [number, number];
}

export default function IndiaMap({ selectedState, onStateClick, densityRange }: IndiaMapProps) {
  return (
    <MapContainer
      center={[22.5, 82]}
      zoom={5}
      className="w-full h-[500px] rounded-lg z-0"
      scrollWheelZoom={true}
      style={{ background: 'hsl(var(--muted))' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selectedState={selectedState} />
      {stateCoordinates.map(coord => {
        const data = stateTreeData.find(s => s.state === coord.state);
        if (!data) return null;
        // Filter by density range
        if (data.treeDensity < densityRange[0] || data.treeDensity > densityRange[1]) return null;

        const color = getForestColor(data.forestPercent);
        const isSelected = selectedState === coord.state;
        // Scale radius by area (log scale for visibility)
        const radius = Math.max(8, Math.min(25, Math.log(data.totalAreaSqKm) * 2.5));

        return (
          <CircleMarker
            key={coord.state}
            center={[coord.lat, coord.lng]}
            radius={isSelected ? radius + 5 : radius}
            pathOptions={{
              color: isSelected ? 'hsl(var(--foreground))' : color,
              fillColor: color,
              fillOpacity: 0.75,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onStateClick(coord.state) }}
          >
            <Tooltip direction="top" sticky>
              <div className="font-body text-sm">
                <strong className="font-display">{data.state}</strong>
                <br />Forest Cover: {data.forestPercent}%
                <br />Tree Density: {data.treeDensity.toLocaleString()} /km²
                <br />Trees: {data.treeCount}M
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
