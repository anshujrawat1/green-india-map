import { PRIORITY_META, fmt, PlantationResult } from '@/lib/plantation';
import { StateTreeData } from '@/data/treeData';

export interface StateRow {
  data: StateTreeData;
  metrics?: PlantationResult;
}

interface Props {
  rows: StateRow[];
  selectedState: string | null;
  hoveredState: string | null;
  onSelect: (state: string | null) => void;
  onHover: (state: string | null) => void;
}

export default function StateList({ rows, selectedState, hoveredState, onSelect, onHover }: Props) {
  return (
    <div className="glass-card rounded-lg p-4">
      <h3 className="font-display font-bold text-foreground mb-3">States in view</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No states match the current filters.</p>
      ) : (
        <div className="max-h-[320px] overflow-y-auto pr-1 divide-y divide-border">
          {rows.map(({ data, metrics }) => {
            const active = selectedState === data.state;
            const hover = hoveredState === data.state;
            return (
              <button
                key={data.state}
                onClick={() => onSelect(active ? null : data.state)}
                onMouseEnter={() => onHover(data.state)}
                onMouseLeave={() => onHover(null)}
                className={`w-full text-left py-2 px-2 rounded-md transition-colors ${
                  active ? 'bg-primary/10' : hover ? 'bg-accent' : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{data.state}</span>
                  {metrics && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${PRIORITY_META[metrics.priority].color}22`, color: PRIORITY_META[metrics.priority].color }}
                    >
                      {metrics.priority}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 text-[11px] text-muted-foreground mt-0.5">
                  <span>{data.forestPercent}% forest</span>
                  <span>{data.treeDensity.toLocaleString()} /km²</span>
                  {metrics && <span>deficit {fmt(metrics.treeDeficit)}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
