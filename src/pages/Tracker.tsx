import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, ArrowLeft, CheckCircle2, Circle, Sprout, Target, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import {
  computeAll, PlantationResult, PRIORITY_META, PRIORITY_ORDER, fmt, fmtFull, yearsToClose,
} from '@/lib/plantation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TRACKED_PRIORITIES = ['Critical', 'High'] as const;
const HORIZON_YEARS = 10;

export default function Tracker() {
  const all = useMemo(() => computeAll(), []);
  const tracked = useMemo(
    () =>
      all
        .filter(r => (TRACKED_PRIORITIES as readonly string[]).includes(r.priority))
        .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority) || b.treeDeficit - a.treeDeficit),
    [all],
  );

  const [started, setStarted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from('tracker_progress').select('region, started');
      if (!active) return;
      if (error) {
        toast.error('Could not load saved progress');
      } else {
        const map: Record<string, boolean> = {};
        (data ?? []).forEach(row => { map[row.region] = !!row.started; });
        setStarted(map);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const toggle = async (region: string) => {
    const next = !started[region];
    const prev = started;
    setStarted({ ...started, [region]: next });
    const { error } = await supabase
      .from('tracker_progress')
      .upsert({ region, started: next, updated_at: new Date().toISOString() }, { onConflict: 'region' });
    if (error) {
      setStarted(prev);
      toast.error('Could not save progress');
    }
  };

  const startedCount = tracked.filter(r => started[r.region]).length;
  const totalDeficit = tracked.reduce((s, r) => s + r.treeDeficit, 0);
  const startedDeficit = tracked.filter(r => started[r.region]).reduce((s, r) => s + r.treeDeficit, 0);

  /** Annual planting rate for a started state: its suggested plantation (millions/yr). */
  const annualRate = (r: PlantationResult) => Math.max(0, r.suggestedPlantation * 1_000_000);

  /** Timeline: remaining combined deficit year by year. Started states plant; others hold steady. */
  const timeline = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const points: Record<string, number | string>[] = [];
    for (let y = 0; y <= HORIZON_YEARS; y++) {
      let remaining = 0;
      let closed = 0;
      tracked.forEach(r => {
        const planted = started[r.region] ? Math.min(annualRate(r) * y, r.treeDeficit) : 0;
        remaining += r.treeDeficit - planted;
        closed += planted;
      });
      points.push({
        year: String(thisYear + y),
        'Remaining deficit': Math.round(remaining),
        'Trees planted': Math.round(closed),
      });
    }
    return points;
  }, [tracked, started]);

  const thisYear = new Date().getFullYear();
  const groups = TRACKED_PRIORITIES
    .map(p => ({ priority: p, items: tracked.filter(r => r.priority === p) }))
    .filter(g => g.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Trees className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Plantation Progress Tracker</h1>
              <p className="text-xs text-muted-foreground">
                Critical & High-priority states · {loading ? 'loading saved progress…' : `${startedCount} of ${tracked.length} started`}
              </p>
            </div>
          </div>
          <Link to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Sprout, label: 'States Started Planting', value: `${startedCount} / ${tracked.length}`, sub: `${tracked.length - startedCount} not yet started`, color: '#059669' },
            { icon: Target, label: 'Combined Tree Deficit', value: fmt(totalDeficit), sub: `${fmtFull(totalDeficit)} trees needed`, color: '#f59e0b' },
            { icon: TrendingDown, label: 'Deficit Under Action', value: fmt(startedDeficit), sub: totalDeficit > 0 ? `${((startedDeficit / totalDeficit) * 100).toFixed(1)}% of total deficit` : '—', color: '#3b82f6' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${c.color}22` }}>
                <c.icon className="h-5 w-5" style={{ color: c.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-display font-bold text-foreground mb-1">📅 Deficit Timeline ({thisYear}–{thisYear + HORIZON_YEARS})</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Started states are assumed to plant their suggested plantation each year until their deficit closes. States not started hold steady.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tickFormatter={v => fmt(Number(v))} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={60} />
                <Tooltip
                  formatter={(v: number, name: string) => [fmtFull(Number(v)), name]}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                />
                <Legend verticalAlign="top" height={30} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                <Area type="monotone" dataKey="Remaining deficit" stroke="#ef4444" fill="#ef444433" strokeWidth={2} />
                <Area type="monotone" dataKey="Trees planted" stroke="#059669" fill="#05966933" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State groups */}
        {groups.map(g => {
          const meta = PRIORITY_META[g.priority];
          const gStarted = g.items.filter(r => started[r.region]).length;
          return (
            <motion.section key={g.priority} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h3 className="font-display font-bold text-foreground">
                  {meta.emoji} {g.priority} Priority
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {gStarted} of {g.items.length} started
                  </span>
                </h3>
                <span className="text-xs text-muted-foreground">Combined deficit: {fmt(g.items.reduce((s, r) => s + r.treeDeficit, 0))}</span>
              </div>
              <div className="space-y-2">
                {g.items.map(r => {
                  const isStarted = !!started[r.region];
                  const yrs = yearsToClose(r.treeDeficit, annualRate(r));
                  return (
                    <button key={r.region} onClick={() => toggle(r.region)}
                      className={`w-full text-left flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                        isStarted ? 'border-emerald-600/40 bg-emerald-950/30' : 'border-border bg-card/40 hover:bg-muted/40'
                      }`}>
                      {isStarted
                        ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        : <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{r.region}</span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>
                            {r.deficitPercent.toFixed(0)}% deficit
                          </span>
                          {isStarted && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-500">
                              🌱 Planting started
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Deficit {fmt(r.treeDeficit)} · Suggested plantation {r.suggestedPlantation.toFixed(2)}M trees/yr
                          {isStarted && isFinite(yrs) && ` · Deficit closes in ~${yrs} yr${yrs === 1 ? '' : 's'} (by ${thisYear + yrs})`}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                        {isStarted ? 'Click to pause' : 'Click to mark started'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}

        <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          Progress is saved to the shared database and restored on every visit · Timeline assumes suggested plantation is achieved every year once started
        </footer>
      </main>
    </div>
  );
}
