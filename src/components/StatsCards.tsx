import { getAggregateStats } from '@/data/treeData';
import { Trees, Leaf, TriangleAlert, BarChart3 } from 'lucide-react';

const icons = [
  { icon: Trees, label: 'Total Trees', key: 'totalTrees' as const, suffix: 'M', color: 'text-success' },
  { icon: BarChart3, label: 'Avg Tree Density', key: 'avgDensity' as const, suffix: '/km²', color: 'text-info' },
  { icon: Leaf, label: 'Forest Cover', key: 'forestPercent' as const, suffix: '%', color: 'text-primary' },
  { icon: TriangleAlert, label: 'Plantation Needed', key: 'totalPlantationNeeded' as const, suffix: 'M trees', color: 'text-warning' },
];

export default function StatsCards() {
  const stats = getAggregateStats();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {icons.map(({ icon: Icon, label, key, suffix, color }, i) => (
        <div
          key={key}
          className="glass-card stat-glow rounded-lg p-5 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
          </div>
          <p className="text-2xl font-display font-bold text-foreground">
            {stats[key].toLocaleString()}<span className="text-sm font-body text-muted-foreground ml-1">{suffix}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
