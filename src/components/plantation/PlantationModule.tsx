import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TreePine, Target, TrendingDown, Download, Info, Sparkles } from 'lucide-react';
import {
  computeAll, PlantationResult, PRIORITY_META, BENCHMARK,
  fmt, fmtFull, generateInsights, getDeficitColor,
} from '@/lib/plantation';
import { POPULATION_SOURCE, POPULATION_UPDATED } from '@/data/populationData';
import DeficitMap from './DeficitMap';
import {
  DeficitBarChart, PopulationScatterChart, ExistingVsRequiredChart, PriorityPieChart, ScenarioSimulation,
} from './PlantationCharts';

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
};

/** Animated semicircular priority meter */
function PriorityMeter({ result }: { result: PlantationResult }) {
  const pct = Math.min(100, result.deficitPercent);
  const meta = PRIORITY_META[result.priority];
  const r = 70, circ = Math.PI * r;
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col items-center">
      <h4 className="font-display font-bold text-foreground mb-2 self-start">🎯 Plantation Priority</h4>
      <svg viewBox="0 0 180 105" className="w-full max-w-[240px]">
        <path d="M20 95 A70 70 0 0 1 160 95" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
        <motion.path
          d="M20 95 A70 70 0 0 1 160 95" fill="none" stroke={meta.color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <text x="90" y="82" textAnchor="middle" className="font-display" fontSize="26" fontWeight="700" fill={meta.color}>
          {pct.toFixed(0)}%
        </text>
        <text x="90" y="98" textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">deficit</text>
      </svg>
      <span className="mt-2 px-3 py-1 rounded-full text-sm font-semibold"
        style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
        {meta.emoji} {result.priority} Priority
      </span>
      <p className="text-xs text-muted-foreground mt-2 text-center">{meta.action}</p>
    </div>
  );
}

/** Animated existing vs required comparison bars */
function ComparisonBars({ result }: { result: PlantationResult }) {
  const max = Math.max(result.requiredTrees, result.existingTrees) || 1;
  const rows = [
    { label: 'Existing Trees', value: result.existingTrees, color: '#059669' },
    { label: 'Required Trees', value: result.requiredTrees, color: '#f59e0b' },
    { label: result.treeDeficit > 0 ? 'Tree Deficit' : 'Surplus', value: result.treeDeficit > 0 ? result.treeDeficit : result.surplus, color: result.treeDeficit > 0 ? '#ef4444' : '#065f46' },
  ];
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <h4 className="font-display font-bold text-foreground">📊 Existing vs Required</h4>
      {rows.map(row => (
        <div key={row.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-display font-bold text-foreground">{fmt(row.value)}</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ backgroundColor: row.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(row.value / max) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        Required Trees = Population × {BENCHMARK}. Existing tree counts from ISFR reported estimates.
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Users; label: string; value: string; sub: string; color: string;
}) {
  return (
    <motion.div {...fade} className="glass-card rounded-xl p-5 stat-glow">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-2 rounded-lg" style={{ backgroundColor: `${color}1a` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display font-extrabold text-2xl text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </motion.div>
  );
}

export default function PlantationModule() {
  const ratio = BENCHMARK;
  const [selected, setSelected] = useState<string>('Delhi');
  const [years, setYears] = useState(10);
  const [annualPlanted, setAnnualPlanted] = useState(5_000_000);

  const results = useMemo(() => computeAll(ratio), [ratio]);
  const current = useMemo(
    () => results.find(r => r.region === selected) ?? results[0],
    [results, selected]
  );
  const insights = useMemo(() => (current ? generateInsights(current, results) : []), [current, results]);

  const totals = useMemo(() => ({
    population: results.reduce((s, r) => s + r.population, 0),
    existing: results.reduce((s, r) => s + r.existingTrees, 0),
    required: results.reduce((s, r) => s + r.requiredTrees, 0),
    stateDeficit: results.reduce((s, r) => s + r.treeDeficit, 0),
    critical: results.filter(r => r.priority === 'Critical').length,
  }), [results]);
  const nationalNet = totals.existing - totals.required;
  const targetMet = nationalNet >= 0;

  const ranking = useMemo(() => [...results].sort((a, b) => b.treeDeficit - a.treeDeficit), [results]);

  const exportCsv = () => {
    const header = ['Region', 'Level', 'Population', 'Existing Trees', 'Required Trees', 'Tree Deficit', 'Surplus', 'Trees per Person', 'Achievement %', 'Deficit %', 'Priority'];
    const rows = ranking.map(r => [
      r.region, r.level, Math.round(r.population), Math.round(r.existingTrees), Math.round(r.requiredTrees),
      Math.round(r.treeDeficit), Math.round(r.surplus), r.treesPerPerson.toFixed(2),
      r.achievementPercent.toFixed(2), r.deficitPercent.toFixed(2), r.priority,
    ].join(','));
    const csv = [`Benchmark: ${ratio} trees per person`, header.join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantation-priority-${ratio}tpp.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!current) return null;

  return (
    <section id="population-module" className="space-y-6">
      {/* Header + controls */}
      <motion.div {...fade} className="glass-card rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-xl text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              Population-Based Tree Requirement
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              How many trees an area should have for its population — and how far it currently falls short.
            </p>
          </div>
          <button onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Project benchmark</label>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-md">
              <Target className="h-4 w-4" /> {BENCHMARK} Trees / Person
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Fixed benchmark. Required Trees = Population × {BENCHMARK} — forest cover and tree density are not used here.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Region (state level)</label>
            <select value={selected} onChange={e => setSelected(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-ring outline-none">
              {[...results].sort((a, b) => a.region.localeCompare(b.region)).map(r => (
                <option key={r.region} value={r.region}>{r.region}</option>
              ))}
            </select>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Info className="h-3 w-3" /> Source: {POPULATION_SOURCE} · Updated {POPULATION_UPDATED}
            </p>
          </div>
        </div>
      </motion.div>

      {/* National totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Population" value={fmt(totals.population)} sub="Sum of all mapped states" color="#3b82f6" />
        <StatCard icon={TreePine} label="National Existing Trees" value={fmt(totals.existing)} sub="Sum of state tree counts" color="#059669" />
        <StatCard icon={Target} label="National Required Trees" value={fmt(totals.required)} sub={`Population × ${BENCHMARK}`} color="#f59e0b" />
        <StatCard
          icon={TrendingDown}
          label={targetMet ? 'National Target Met' : 'National Deficit'}
          value={`${targetMet ? '+' : '−'}${fmt(Math.abs(nationalNet))}`}
          sub={targetMet ? 'Existing exceeds required nationally' : 'Existing below required nationally'}
          color={targetMet ? '#059669' : '#ef4444'}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard icon={TrendingDown} label="Total State-Level Tree Deficit"
          value={fmt(totals.stateDeficit)} sub="Sum of per-state positive deficits only" color="#ef4444" />
        <StatCard icon={Sparkles} label="Critical Priority States"
          value={`${totals.critical}`} sub="Deficit above 75% of requirement" color="#f97316" />
      </div>

      {/* Selected region detail */}
      <AnimatePresence mode="wait">
        <motion.div key={`${current.region}-${ratio}`} {...fade} exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h4 className="font-display font-bold text-foreground">{current.region}</h4>
            {[
              { l: 'Population', v: fmtFull(current.population) },
              { l: 'Existing Trees', v: fmt(current.existingTrees) },
              { l: `Required (${BENCHMARK}/person)`, v: fmt(current.requiredTrees) },
              current.treeDeficit > 0
                ? { l: 'Tree Deficit', v: fmt(current.treeDeficit) }
                : { l: 'Surplus', v: fmt(current.surplus) },
              { l: 'Trees per Person', v: current.treesPerPerson.toFixed(2) },
              { l: 'Target Achievement', v: `${current.achievementPercent.toFixed(2)}%` },
              { l: 'Deficit', v: `${current.deficitPercent.toFixed(2)}%` },
              { l: 'Priority', v: `${PRIORITY_META[current.priority].emoji} ${current.priority}` },
              { l: 'Forest Cover (separate metric)', v: `${current.forestPercent}%` },
            ].map(row => (
              <div key={row.l} className="flex justify-between text-sm border-b border-border/60 pb-1.5 last:border-0">
                <span className="text-muted-foreground">{row.l}</span>
                <span className="font-display font-bold text-foreground">{row.v}</span>
              </div>
            ))}
          </div>
          <PriorityMeter result={current} />
          <ComparisonBars result={current} />
        </motion.div>
      </AnimatePresence>

      {/* Automated insights */}
      <motion.div {...fade} className="glass-card rounded-xl p-5">
        <h4 className="font-display font-bold text-foreground mb-3">🧠 Automated Insights</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {insights.map((i, idx) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="text-sm text-foreground bg-accent/50 rounded-md px-3 py-2">
              {i}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Deficit map */}
      <motion.div {...fade} className="glass-card rounded-xl p-5">
        <h4 className="font-display font-bold text-foreground mb-4">🗺️ Tree Deficit Map — click a state to analyse</h4>
        <DeficitMap results={results} selected={current.region} onSelect={setSelected} />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeficitBarChart results={results} />
        <PopulationScatterChart results={results} />
        <ExistingVsRequiredChart results={results} />
        <PriorityPieChart results={results} />
      </div>

      <ScenarioSimulation result={current} years={years} onYearsChange={setYears}
        annualPlanted={annualPlanted} onAnnualChange={setAnnualPlanted} />

      {/* Ranking table */}
      <motion.div {...fade} className="glass-card rounded-xl p-5">
        <h4 className="font-display font-bold text-foreground mb-4">🏆 Plantation Priority Ranking</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                {['#', 'Region', 'Population', 'Existing', 'Required', 'Deficit', 'Priority'].map(h => (
                  <th key={h} className="py-2 pr-4 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.region}
                  onClick={() => setSelected(r.region)}
                  className={`border-b border-border/50 cursor-pointer transition-colors hover:bg-accent/50 ${
                    r.region === current.region ? 'bg-accent/60' : ''}`}>
                  <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
                  <td className="py-2 pr-4 font-medium text-foreground whitespace-nowrap">{r.region}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{fmt(r.population)}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{fmt(r.existingTrees)}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{fmt(r.requiredTrees)}</td>
                  <td className="py-2 pr-4 font-semibold" style={{ color: getDeficitColor(r.deficitPercent) }}>{fmt(r.treeDeficit)}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${PRIORITY_META[r.priority].color}22`, color: PRIORITY_META[r.priority].color }}>
                      {PRIORITY_META[r.priority].emoji} {r.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
