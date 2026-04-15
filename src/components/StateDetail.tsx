import { stateTreeData, getForestColor } from '@/data/treeData';
import { X } from 'lucide-react';

interface Props {
  state: string;
  onClose: () => void;
}

export default function StateDetail({ state, onClose }: Props) {
  const data = stateTreeData.find(s => s.state === state);
  if (!data) return null;

  const color = getForestColor(data.forestPercent);

  return (
    <div className="glass-card rounded-lg p-5 animate-fade-in border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-lg text-foreground">{data.state}</h3>
        <button onClick={onClose} className="p-1 hover:bg-accent rounded-md transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: 'Total Area', value: `${data.totalAreaSqKm.toLocaleString()} km²` },
          { label: 'Forest Area', value: `${data.forestAreaSqKm.toLocaleString()} km²` },
          { label: 'Forest Cover', value: `${data.forestPercent}%` },
          { label: 'Tree Count', value: `${data.treeCount}M` },
          { label: 'Tree Density', value: `${data.treeDensity.toLocaleString()}/km²` },
          { label: 'Trees Needed', value: `${data.suggestedPlantation}M` },
        ].map(({ label, value }) => (
          <div key={label}>
            <span className="text-muted-foreground">{label}</span>
            <p className="font-display font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
