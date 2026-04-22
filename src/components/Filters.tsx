import { stateTreeData } from '@/data/treeData';

interface FiltersProps {
  selectedState: string | null;
  onStateChange: (state: string | null) => void;
  densityRange: [number, number];
  onDensityChange: (range: [number, number]) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const MAX_DENSITY = 45000;

export default function Filters({ selectedState, onStateChange, densityRange, onDensityChange, searchQuery, onSearchChange }: FiltersProps) {
  const filteredStates = stateTreeData
    .filter(s => s.state.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.state.localeCompare(b.state));

  return (
    <div className="glass-card rounded-lg p-5 space-y-4">
      <h3 className="font-display font-bold text-foreground">🔍 Filters</h3>

      {/* State dropdown */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">Select State</label>
        <select
          value={selectedState || ''}
          onChange={e => onStateChange(e.target.value || null)}
          className="w-full py-2 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
        >
          <option value="">All States</option>
          {filteredStates.map(s => (
            <option key={s.state} value={s.state}>{s.state}</option>
          ))}
        </select>
      </div>

      {/* Density slider */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">
          Min Density: {densityRange[0].toLocaleString()} /km²
        </label>
        <input
          type="range"
          min={0}
          max={MAX_DENSITY}
          step={500}
          value={densityRange[0]}
          onChange={e => onDensityChange([Number(e.target.value), densityRange[1]])}
          className="w-full accent-primary"
        />
        <label className="text-sm text-muted-foreground font-medium mb-1 block mt-2">
          Max Density: {densityRange[1].toLocaleString()} /km²
        </label>
        <input
          type="range"
          min={0}
          max={MAX_DENSITY}
          step={500}
          value={densityRange[1]}
          onChange={e => onDensityChange([densityRange[0], Number(e.target.value)])}
          className="w-full accent-primary"
        />
      </div>

      {/* Legend */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Map Legend</p>
        <div className="space-y-1 text-xs">
          {[
            { color: '#065f46', label: 'Very Dense (>70%)' },
            { color: '#059669', label: 'Dense (40-70%)' },
            { color: '#34d399', label: 'Moderate (20-40%)' },
            { color: '#fbbf24', label: 'Low (10-20%)' },
            { color: '#ef4444', label: 'Very Low (<10%)' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
