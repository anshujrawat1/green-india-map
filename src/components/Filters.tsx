import { stateTreeData } from '@/data/treeData';
import { PRIORITY_META, PRIORITY_ORDER, Priority } from '@/lib/plantation';
import { RotateCcw } from 'lucide-react';

export type ColorMode = 'forest' | 'density' | 'priority';
export type SortKey = 'name' | 'forest' | 'density' | 'trees' | 'deficit';

export interface FilterState {
  colorMode: ColorMode;
  sortKey: SortKey;
  densityRange: [number, number];
  forestRange: [number, number];
  priorities: Priority[];
}

export const MAX_DENSITY = 45000;

export const defaultFilters: FilterState = {
  colorMode: 'forest',
  sortKey: 'name',
  densityRange: [0, MAX_DENSITY],
  forestRange: [0, 100],
  priorities: [],
};

interface FiltersProps {
  selectedState: string | null;
  onStateChange: (state: string | null) => void;
  filters: FilterState;
  onChange: (next: FilterState) => void;
  matchCount: number;
}

const forestLegend = [
  { color: '#065f46', label: 'Very Dense (>70%)' },
  { color: '#059669', label: 'Dense (40-70%)' },
  { color: '#34d399', label: 'Moderate (20-40%)' },
  { color: '#fbbf24', label: 'Low (10-20%)' },
  { color: '#ef4444', label: 'Very Low (<10%)' },
];

const densityLegend = [
  { color: '#065f46', label: 'Very High (>30k /km²)' },
  { color: '#059669', label: 'High (15k-30k)' },
  { color: '#34d399', label: 'Medium (7k-15k)' },
  { color: '#fbbf24', label: 'Low (2k-7k)' },
  { color: '#ef4444', label: 'Very Low (<2k)' },
];

export default function Filters({ selectedState, onStateChange, filters = defaultFilters, onChange, matchCount }: FiltersProps) {
  const states = [...stateTreeData].sort((a, b) => a.state.localeCompare(b.state));
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) => onChange({ ...filters, [key]: value });

  const togglePriority = (p: Priority) =>
    set('priorities', filters.priorities.includes(p)
      ? filters.priorities.filter(x => x !== p)
      : [...filters.priorities, p]);

  const legend = filters.colorMode === 'forest' ? forestLegend
    : filters.colorMode === 'density' ? densityLegend
    : PRIORITY_ORDER.map(p => ({ color: PRIORITY_META[p].color, label: `${p} (${PRIORITY_META[p].range})` }));

  return (
    <div className="glass-card rounded-lg p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-foreground">🔍 Explore</h3>
        <button
          onClick={() => { onChange(defaultFilters); onStateChange(null); }}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* State dropdown */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">Select State</label>
        <select
          value={selectedState || ''}
          onChange={e => onStateChange(e.target.value || null)}
          className="w-full py-2 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
        >
          <option value="">All States</option>
          {states.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
        </select>
      </div>

      {/* Colour mode */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">Colour map by</label>
        <div className="grid grid-cols-3 gap-1 p-1 rounded-md bg-muted">
          {([
            ['forest', 'Forest %'],
            ['density', 'Density'],
            ['priority', 'Priority'],
          ] as [ColorMode, string][]).map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => set('colorMode', mode)}
              className={`py-1.5 rounded text-xs font-medium transition-colors ${
                filters.colorMode === mode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">Sort states by</label>
        <select
          value={filters.sortKey}
          onChange={e => set('sortKey', e.target.value as SortKey)}
          className="w-full py-2 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none"
        >
          <option value="name">Name (A–Z)</option>
          <option value="forest">Forest cover (high → low)</option>
          <option value="density">Tree density (high → low)</option>
          <option value="trees">Tree count (high → low)</option>
          <option value="deficit">Tree deficit (high → low)</option>
        </select>
      </div>

      {/* Density slider */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">
          Density: {filters.densityRange[0].toLocaleString()} – {filters.densityRange[1].toLocaleString()} /km²
        </label>
        <input
          type="range" min={0} max={MAX_DENSITY} step={500}
          value={filters.densityRange[0]}
          onChange={e => set('densityRange', [Math.min(Number(e.target.value), filters.densityRange[1]), filters.densityRange[1]])}
          className="w-full accent-primary"
        />
        <input
          type="range" min={0} max={MAX_DENSITY} step={500}
          value={filters.densityRange[1]}
          onChange={e => set('densityRange', [filters.densityRange[0], Math.max(Number(e.target.value), filters.densityRange[0])])}
          className="w-full accent-primary"
        />
      </div>

      {/* Forest % slider */}
      <div>
        <label className="text-sm text-muted-foreground font-medium mb-1 block">
          Forest cover: {filters.forestRange[0]}% – {filters.forestRange[1]}%
        </label>
        <input
          type="range" min={0} max={100} step={1}
          value={filters.forestRange[0]}
          onChange={e => set('forestRange', [Math.min(Number(e.target.value), filters.forestRange[1]), filters.forestRange[1]])}
          className="w-full accent-primary"
        />
        <input
          type="range" min={0} max={100} step={1}
          value={filters.forestRange[1]}
          onChange={e => set('forestRange', [filters.forestRange[0], Math.max(Number(e.target.value), filters.forestRange[0])])}
          className="w-full accent-primary"
        />
      </div>

      {/* Priority chips */}
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-2">Priority</p>
        <div className="flex flex-wrap gap-1.5">
          {PRIORITY_ORDER.map(p => {
            const active = filters.priorities.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePriority(p)}
                style={active ? { backgroundColor: PRIORITY_META[p].color, borderColor: PRIORITY_META[p].color } : undefined}
                className={`px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                  active ? 'text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {PRIORITY_META[p].emoji} {p}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing <span className="font-bold text-foreground">{matchCount}</span> of {stateTreeData.length} states
      </p>

      {/* Legend */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-2">Map Legend</p>
        <div className="space-y-1 text-xs">
          {legend.map(({ color, label }) => (
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
