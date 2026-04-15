import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { getTopStates, getBottomStates, stateTreeData, yearLabels } from '@/data/treeData';

const GREENS = ['#065f46', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#bbf7d0', '#4ade80', '#22c55e'];
const REDS = ['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#dc2626', '#b91c1c', '#991b1b', '#f97316', '#fb923c'];
const PIE_COLORS = ['#059669', '#fbbf24', '#ef4444'];

/** Top 10 states bar chart */
export function TopStatesChart() {
  const data = getTopStates(10).map(s => ({ name: s.state.length > 12 ? s.state.slice(0, 10) + '…' : s.state, density: s.treeDensity, fullName: s.state }));
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-4">🌲 Top 10 — Highest Tree Density</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="density" name="Trees/km²">
            {data.map((_, i) => <Cell key={i} fill={GREENS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Bottom 10 states bar chart */
export function BottomStatesChart() {
  const data = getBottomStates(10).map(s => ({ name: s.state.length > 12 ? s.state.slice(0, 10) + '…' : s.state, density: s.treeDensity, plantation: s.suggestedPlantation }));
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-4">🚨 Bottom 10 — Need Plantation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
          <Bar dataKey="density" name="Trees/km²">
            {data.map((_, i) => <Cell key={i} fill={REDS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Pie chart: Forest distribution */
export function ForestPieChart() {
  const totalArea = stateTreeData.reduce((s, d) => s + d.totalAreaSqKm, 0);
  const denseForest = stateTreeData.filter(s => s.forestPercent >= 40).reduce((s, d) => s + d.forestAreaSqKm, 0);
  const moderateForest = stateTreeData.filter(s => s.forestPercent >= 10 && s.forestPercent < 40).reduce((s, d) => s + d.forestAreaSqKm, 0);
  const nonForest = totalArea - denseForest - moderateForest;

  const data = [
    { name: 'Dense Forest (>40%)', value: Math.round(denseForest) },
    { name: 'Moderate (10-40%)', value: Math.round(moderateForest) },
    { name: 'Low/Non-Forest (<10%)', value: Math.round(nonForest) },
  ];

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-4">🌍 Forest Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
            {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
          </Pie>
          <Legend />
          <Tooltip formatter={(v: number) => `${v.toLocaleString()} km²`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Line chart: Growth over time for top 5 fastest growing */
export function GrowthLineChart() {
  const top5 = [...stateTreeData]
    .sort((a, b) => b.yearlyGrowth.reduce((s, v) => s + v, 0) - a.yearlyGrowth.reduce((s, v) => s + v, 0))
    .slice(0, 5);

  const data = yearLabels.map((year, yi) => {
    const entry: Record<string, string | number> = { year };
    top5.forEach(s => { entry[s.state] = s.yearlyGrowth[yi]; });
    return entry;
  });

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-4">📈 Afforestation Growth (Top 5)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} unit="%" />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
          <Legend />
          {top5.map((s, i) => (
            <Line key={s.state} type="monotone" dataKey={s.state} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
