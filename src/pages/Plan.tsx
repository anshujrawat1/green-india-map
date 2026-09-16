import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trees, AlertTriangle, MapPin, Target } from 'lucide-react';
import {
  computeAll, PRIORITY_ORDER, PRIORITY_META, BENCHMARK,
  fmt, fmtFull, PlantationResult, Priority,
} from '@/lib/plantation';

const fade = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' as const },
};

function PriorityGroup({ priority, states }: { priority: Priority; states: PlantationResult[] }) {
  const meta = PRIORITY_META[priority];
  const totalDeficit = states.reduce((s, r) => s + r.treeDeficit, 0);
  const totalArea = states.reduce((s, r) => s + r.totalAreaSqKm, 0);
  const totalSuggested = states.reduce((s, r) => s + r.suggestedPlantation, 0);

  return (
    <motion.section {...fade} className="glass-card rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.emoji}</span>
          <h2 className="font-display font-bold text-foreground text-lg">{priority} Priority</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
            {states.length} {states.length === 1 ? 'state' : 'states'}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{meta.range} deficit</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="rounded-lg bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Combined Deficit</p>
          <p className="font-display font-bold text-foreground">{fmt(totalDeficit)}</p>
        </div>
        <div className="rounded-lg bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Combined Area</p>
          <p className="font-display font-bold text-foreground">{fmtFull(totalArea)} km²</p>
        </div>
        <div className="rounded-lg bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Suggested Plantation</p>
          <p className="font-display font-bold text-foreground">{fmt(totalSuggested)}M</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 pr-4 font-medium">State / UT</th>
              <th className="py-2 pr-4 font-medium text-right">Tree Deficit</th>
              <th className="py-2 pr-4 font-medium text-right">Deficit %</th>
              <th className="py-2 pr-4 font-medium text-right">Total Area</th>
              <th className="py-2 pr-4 font-medium text-right">Suggested Plantation</th>
              <th className="py-2 pr-4 font-medium text-right">Trees / Person</th>
            </tr>
          </thead>
          <tbody>
            {states.map(r => (
              <tr key={r.region} className="border-b border-border/50">
                <td className="py-2 pr-4 font-medium text-foreground whitespace-nowrap">{r.region}</td>
                <td className="py-2 pr-4 text-right font-semibold" style={{ color: meta.color }}>{fmt(r.treeDeficit)}</td>
                <td className="py-2 pr-4 text-right text-muted-foreground">{r.deficitPercent.toFixed(2)}%</td>
                <td className="py-2 pr-4 text-right text-muted-foreground">{fmtFull(r.totalAreaSqKm)} km²</td>
                <td className="py-2 pr-4 text-right text-muted-foreground">{r.suggestedPlantation.toFixed(2)}M</td>
                <td className="py-2 pr-4 text-right text-muted-foreground">{r.treesPerPerson.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

export default function Plan() {
  const results = useMemo(() => computeAll(BENCHMARK), []);

  const grouped = useMemo(() => {
    const map: Record<Priority, PlantationResult[]> = {
      'Target Met': [],
      Low: [],
      Moderate: [],
      High: [],
      Critical: [],
    };
    for (const r of results) {
      map[r.priority].push(r);
    }
    for (const key of Object.keys(map) as Priority[]) {
      map[key].sort((a, b) => b.treeDeficit - a.treeDeficit);
    }
    return map;
  }, [results]);

  const totals = useMemo(() => ({
    states: results.length,
    deficit: results.reduce((s, r) => s + r.treeDeficit, 0),
    area: results.reduce((s, r) => s + r.totalAreaSqKm, 0),
    suggested: results.reduce((s, r) => s + r.suggestedPlantation, 0),
    critical: results.filter(r => r.priority === 'Critical').length,
  }), [results]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Trees className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">National Plantation Plan</h1>
              <p className="text-xs text-muted-foreground">Priority-wise action plan for tree plantation across India</p>
            </div>
          </div>
          <Link to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div {...fade} className="glass-card rounded-xl p-5 stat-glow">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-primary/10"><MapPin className="h-4 w-4 text-primary" /></span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">States / UTs</span>
            </div>
            <p className="font-display font-extrabold text-2xl text-foreground">{totals.states}</p>
          </motion.div>
          <motion.div {...fade} className="glass-card rounded-xl p-5 stat-glow">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-red-500/10"><AlertTriangle className="h-4 w-4 text-red-500" /></span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Tree Deficit</span>
            </div>
            <p className="font-display font-extrabold text-2xl text-foreground">{fmt(totals.deficit)}</p>
          </motion.div>
          <motion.div {...fade} className="glass-card rounded-xl p-5 stat-glow">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-emerald-500/10"><Trees className="h-4 w-4 text-emerald-500" /></span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested Plantation</span>
            </div>
            <p className="font-display font-extrabold text-2xl text-foreground">{totals.suggested.toFixed(2)}M</p>
          </motion.div>
          <motion.div {...fade} className="glass-card rounded-xl p-5 stat-glow">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-amber-500/10"><Target className="h-4 w-4 text-amber-500" /></span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Critical States</span>
            </div>
            <p className="font-display font-extrabold text-2xl text-foreground">{totals.critical}</p>
          </motion.div>
        </div>

        {/* Priority groups — most critical first */}
        <div className="space-y-6">
          {[...PRIORITY_ORDER].reverse().map(priority => {
            const states = grouped[priority];
            if (states.length === 0) return null;
            return <PriorityGroup key={priority} priority={priority} states={states} />;
          })}
        </div>

        <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          Benchmark: {BENCHMARK} trees per person · Data source: Census of India 2011 (Telangana/Ladakh disaggregated)
        </footer>
      </main>
    </div>
  );
}
