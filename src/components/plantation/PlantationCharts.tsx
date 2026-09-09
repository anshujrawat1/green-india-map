import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
  PieChart, Pie, AreaChart, Area, ReferenceLine,
} from 'recharts';
import {
  PlantationResult, simulateScenario, fmt, fmtFull, getDeficitColor, PRIORITY_META,
  PRIORITY_ORDER, BENCHMARK, yearsToClose,
} from '@/lib/plantation';

const short = (s: string) => (s.length > 11 ? s.slice(0, 9) + '…' : s);
const axis = { fontSize: 11, fill: 'hsl(var(--muted-foreground))' };
const tipStyle = { borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' };

function TipBox({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-display font-bold text-foreground mb-1">{title}</p>
      {rows.map(([k, v]) => (
        <p key={k} className="text-muted-foreground">{k}: <span className="text-foreground font-medium">{v}</span></p>
      ))}
    </div>
  );
}

/** 1. Tree deficit horizontal bar chart — top states requiring plantation */
export function DeficitBarChart({ results }: { results: PlantationResult[] }) {
  const data = useMemo(
    () => results.filter(r => r.treeDeficit > 0).sort((a, b) => b.treeDeficit - a.treeDeficit).slice(0, 10)
      .map(r => ({
        name: short(r.region), full: r.region, deficit: Math.round(r.treeDeficit), pct: r.deficitPercent,
        existing: r.existingTrees, required: r.requiredTrees,
      })),
    [results]
  );
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🌳 Top 10 Tree Deficit States</h4>
      <p className="text-xs text-muted-foreground mb-3">Deficit = max(Population × {BENCHMARK} − Existing Trees, 0)</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 18, right: 24 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={axis} tickFormatter={fmt} />
          <YAxis type="category" dataKey="name" tick={axis} width={90} interval={0} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
            content={({ payload }) => {
              const d = payload?.[0]?.payload;
              if (!d) return null;
              return <TipBox title={d.full} rows={[
                ['Existing Trees', fmt(d.existing)],
                ['Required Trees', fmt(d.required)],
                ['Tree Deficit', fmt(d.deficit)],
                ['Deficit %', `${d.pct.toFixed(2)}%`],
              ]} />;
            }}
          />
          <Bar dataKey="deficit" radius={[0, 6, 6, 0]} maxBarSize={34}>
            {data.map((d, i) => <Cell key={i} fill={getDeficitColor(d.pct)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 2. Trees per person vs the 3:1 benchmark — horizontal bars for all states */
export function TreesPerPersonChart({ results }: { results: PlantationResult[] }) {
  const data = useMemo(
    () => [...results].sort((a, b) => b.treesPerPerson - a.treesPerPerson).map(r => ({
      name: short(r.region), full: r.region,
      tpp: Number(r.treesPerPerson.toFixed(2)),
      pct: r.deficitPercent,
      existing: r.existingTrees, population: r.population,
    })),
    [results]
  );
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">👥 Trees per Person vs Benchmark</h4>
      <p className="text-xs text-muted-foreground mb-3">
        Existing trees ÷ population for every state. The dashed line marks the {BENCHMARK} trees/person benchmark.
      </p>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 22)}>
        <BarChart data={data} layout="vertical" margin={{ left: 18, right: 40 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={axis} domain={[0, BENCHMARK]} ticks={[0, 1, 2, 3]} />
          <YAxis type="category" dataKey="name" tick={axis} width={90} interval={0} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
            content={({ payload }) => {
              const d = payload?.[0]?.payload;
              if (!d) return null;
              return <TipBox title={d.full} rows={[
                ['Trees per Person', d.tpp.toFixed(2)],
                ['Benchmark', `${BENCHMARK} trees/person`],
                ['Existing Trees', fmt(d.existing)],
                ['Population', fmtFull(d.population)],
                ['Deficit %', `${d.pct.toFixed(2)}%`],
              ]} />;
            }}
          />
          <ReferenceLine x={BENCHMARK} stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={1.5}
            label={{ value: `Benchmark ${BENCHMARK}/person`, position: 'top', fontSize: 11, fill: '#f59e0b' }} />
          <Bar dataKey="tpp" name="Trees per Person" radius={[0, 4, 4, 0]} maxBarSize={14}>
            {data.map((d, i) => <Cell key={i} fill={getDeficitColor(d.pct)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 3. Existing vs required grouped bars */
export function ExistingVsRequiredChart({ results }: { results: PlantationResult[] }) {
  const data = [...results].sort((a, b) => b.requiredTrees - a.requiredTrees).slice(0, 10).map(r => ({
    name: short(r.region), full: r.region,
    existing: Math.round(r.existingTrees), required: Math.round(r.requiredTrees),
    deficit: Math.round(r.treeDeficit),
  }));
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🌲 Existing vs Required Trees</h4>
      <p className="text-xs text-muted-foreground mb-3">Both series are absolute tree counts on the same scale.</p>
      <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data} margin={{ top: 8, bottom: 62, left: 6, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" tick={axis} interval={0} />
          <YAxis tick={axis} tickFormatter={fmt} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
            content={({ payload }) => {
              const d = payload?.[0]?.payload;
              if (!d) return null;
              return <TipBox title={d.full} rows={[
                ['Existing Trees', fmt(d.existing)],
                ['Required Trees', fmt(d.required)],
                ['Tree Deficit', fmt(d.deficit)],
              ]} />;
            }}
          />
          <Legend verticalAlign="top" align="right" height={28} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="existing" name="Existing" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Bar dataKey="required" name="Required" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={26} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** 4. Priority distribution pie */
export function PriorityPieChart({ results }: { results: PlantationResult[] }) {
  const data = PRIORITY_ORDER.map(p => ({
    name: p, value: results.filter(r => r.priority === p).length, color: PRIORITY_META[p].color,
  })).filter(d => d.value > 0);
  return (
    <div className="glass-card rounded-xl p-5">
      <h4 className="font-display font-bold text-foreground mb-4">🥧 Plantation Priority Distribution</h4>
      <p className="text-xs text-muted-foreground mb-3">
        Based only on deficit % — {results.length} states, each counted once.
      </p>
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

/** 5. Optional scenario simulation — user supplies the annual plantation figure. */
export function ScenarioSimulation({ result, annualPlanted, onAnnualChange, years, onYearsChange }: {
  result: PlantationResult; annualPlanted: number; onAnnualChange: (n: number) => void;
  years: number; onYearsChange: (y: number) => void;
}) {
  const data = useMemo(() => simulateScenario(result, annualPlanted, years), [result, annualPlanted, years]);
  const close = yearsToClose(result.treeDeficit, annualPlanted);
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h4 className="font-display font-bold text-foreground">🧪 Scenario Simulation — {result.region} (optional)</h4>
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
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Annual trees planted</label>
          <input type="number" min={0} step={100000} value={annualPlanted}
            onChange={e => onAnnualChange(Math.max(0, Number(e.target.value) || 0))}
            className="w-48 py-2 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none" />
        </div>
        <p className="text-xs text-muted-foreground">
          Initial deficit {fmt(result.treeDeficit)} ·{' '}
          {result.treeDeficit === 0
            ? 'target already met'
            : Number.isFinite(close) ? `closes in ~${close} year${close === 1 ? '' : 's'}` : 'enter a plantation rate'}
        </p>
      </div>
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
