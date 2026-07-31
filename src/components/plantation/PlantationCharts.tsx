import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  ScatterChart, Scatter, ZAxis, PieChart, Pie, AreaChart, Area,
} from 'recharts';
import { PlantationResult, projectDeficit, fmt, getDeficitColor, PRIORITY_META, Priority } from '@/lib/plantation';

const short = (s: string) => (s.length > 11 ? s.slice(0, 9) + '…' : s);
const axis = { fontSize: 11, fill: 'hsl(var(--muted-foreground))' };
const tipStyle = { borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' };

/** 1. Tree deficit bar chart — top states requiring plantation */
export function DeficitBarChart({ results }: { results: PlantationResult[] }) {
  const data = useMemo(
    () => [...results].sort((a, b) => b.treeDeficit - a.treeDeficit).slice(0, 10)
      .map(r => ({ name: short(r.region), deficit: Math.round(r.treeDeficit), pct: r.deficitPercent })),
    [results]
  );
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🌳 Top 10 Tree Deficit States</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 55 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={axis} interval={0} />
          <YAxis tick={axis} tickFormatter={fmt} />
          <Tooltip contentStyle={tipStyle} formatter={(v: number) => [fmt(v), 'Deficit']} />
          <Bar dataKey="deficit" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={getDeficitColor(d.pct)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 2. Population vs required trees scatter */
export function PopulationScatterChart({ results }: { results: PlantationResult[] }) {
  const data = results.map(r => ({
    x: r.population, y: r.requiredTrees, z: Math.max(r.treeDeficit, 1), name: r.region, pct: r.deficitPercent,
  }));
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">📈 Population vs Required Trees</h4>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" dataKey="x" name="Population" tick={axis} tickFormatter={fmt} />
          <YAxis type="number" dataKey="y" name="Required Trees" tick={axis} tickFormatter={fmt} />
          <ZAxis type="number" dataKey="z" range={[40, 400]} />
          <Tooltip
            contentStyle={tipStyle}
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(v: number, n: string) => [fmt(v), n]}
            labelFormatter={() => ''}
          />
          <Scatter data={data}>
            {data.map((d, i) => <Cell key={i} fill={getDeficitColor(d.pct)} fillOpacity={0.8} />)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 3. Existing vs required grouped bars */
export function ExistingVsRequiredChart({ results }: { results: PlantationResult[] }) {
  const data = [...results].sort((a, b) => b.requiredTrees - a.requiredTrees).slice(0, 10).map(r => ({
    name: short(r.region), existing: Math.round(r.existingTrees), required: Math.round(r.requiredTrees),
  }));
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🌲 Existing vs Required Trees</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ bottom: 55 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={axis} interval={0} />
          <YAxis tick={axis} tickFormatter={fmt} />
          <Tooltip contentStyle={tipStyle} formatter={(v: number) => fmt(v)} />
          <Legend />
          <Bar dataKey="existing" name="Existing" fill="#059669" radius={[4, 4, 0, 0]} />
          <Bar dataKey="required" name="Required" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 4. Priority distribution pie */
export function PriorityPieChart({ results }: { results: PlantationResult[] }) {
  const order: Priority[] = ['Low', 'Moderate', 'High', 'Critical'];
  const data = order.map(p => ({
    name: p, value: results.filter(r => r.priority === p).length, color: PRIORITY_META[p].color,
  })).filter(d => d.value > 0);
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🥧 Plantation Priority Distribution</h4>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3}
            label={({ name, value }) => `${name}: ${value}`}>
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Legend />
          <Tooltip contentStyle={tipStyle} formatter={(v: number) => `${v} states`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 5. Projection chart with 5 / 10 / 20 year horizon */
export function ProjectionChart({ result, years, onYearsChange }: {
  result: PlantationResult; years: number; onYearsChange: (y: number) => void;
}) {
  const data = useMemo(() => projectDeficit(result, years), [result, years]);
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h4 className="font-display font-bold text-foreground">🔮 Deficit Projection — {result.region}</h4>
        <div className="flex gap-1">
          {[5, 10, 20].map(y => (
            <button key={y} onClick={() => onYearsChange(y)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                years === y ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              {y}Y
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Assumes 5% of the remaining deficit is planted every year.</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="defGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="plantGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="year" tick={axis} />
          <YAxis tick={axis} tickFormatter={fmt} />
          <Tooltip contentStyle={tipStyle} formatter={(v: number) => fmt(v)} />
          <Legend />
          <Area type="monotone" dataKey="deficit" name="Remaining Deficit" stroke="#ef4444" fill="url(#defGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="planted" name="Cumulative Planted" stroke="#059669" fill="url(#plantGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
