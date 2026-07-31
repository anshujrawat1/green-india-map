/**
 * Core population-based plantation logic.
 * Level-agnostic: works for country / state / district / city / ward as long as the
 * caller supplies a `RegionMetrics` object. No UI or state-specific assumptions here.
 */
import { stateTreeData } from '@/data/treeData';
import { populationData, RegionLevel } from '@/data/populationData';

/** Average trees per hectare used when an actual tree count is unavailable. */
export const AVG_TREES_PER_HECTARE = 400;

export const RATIO_OPTIONS = [1, 2, 3, 5] as const;
export const DEFAULT_RATIO = 3;

export interface RegionMetrics {
  region: string;
  level: RegionLevel;
  parent?: string;
  population: number;
  totalAreaSqKm: number;
  forestAreaSqKm: number;
  forestPercent: number;
  /** Reported tree count in absolute trees (may be undefined) */
  reportedTrees?: number;
  source: string;
  lastUpdated: string;
}

export interface PlantationResult extends RegionMetrics {
  existingTrees: number;
  estimated: boolean;      // true when existingTrees was derived from forest area
  requiredTrees: number;
  treeDeficit: number;
  /** deficit as % of required trees (0-100) */
  deficitPercent: number;
  priority: Priority;
}

export type Priority = 'Low' | 'Moderate' | 'High' | 'Critical';

export const PRIORITY_META: Record<Priority, { color: string; emoji: string; range: string; action: string }> = {
  Low: { color: '#065f46', emoji: '🟢', range: '0–10%', action: 'Maintain existing forest cover.' },
  Moderate: { color: '#84cc16', emoji: '🟡', range: '10–30%', action: 'Increase annual plantation by 20%.' },
  High: { color: '#f97316', emoji: '🟠', range: '30–60%', action: 'Prioritize urban green corridors.' },
  Critical: { color: '#ef4444', emoji: '🔴', range: '> 60%', action: 'Immediate plantation required.' },
};

export const getPriority = (deficitPercent: number): Priority => {
  if (deficitPercent > 60) return 'Critical';
  if (deficitPercent > 30) return 'High';
  if (deficitPercent > 10) return 'Moderate';
  return 'Low';
};

/** Deficit-based map / chart color scale */
export const getDeficitColor = (deficitPercent: number): string => {
  if (deficitPercent > 60) return '#ef4444';   // critical
  if (deficitPercent > 40) return '#f97316';   // high
  if (deficitPercent > 20) return '#fbbf24';   // medium
  if (deficitPercent > 10) return '#84cc16';   // moderate
  return '#065f46';                            // very low
};

/** Estimate existing trees from forest area when a reported count is missing. */
export const estimateTreesFromForest = (forestAreaSqKm: number) =>
  forestAreaSqKm * 100 * AVG_TREES_PER_HECTARE; // 1 km² = 100 ha

/** Pure calculation — the single source of truth for every level of the hierarchy. */
export function computePlantation(metrics: RegionMetrics, ratio: number): PlantationResult {
  const estimated = metrics.reportedTrees == null;
  const existingTrees = estimated
    ? estimateTreesFromForest(metrics.forestAreaSqKm)
    : (metrics.reportedTrees as number);
  const requiredTrees = metrics.population * ratio;
  const treeDeficit = Math.max(0, requiredTrees - existingTrees);
  const deficitPercent = requiredTrees > 0 ? (treeDeficit / requiredTrees) * 100 : 0;
  return {
    ...metrics,
    existingTrees,
    estimated,
    requiredTrees,
    treeDeficit,
    deficitPercent,
    priority: getPriority(deficitPercent),
  };
}

/** Adapter: today's state-level dataset -> RegionMetrics. Swap this for districts later. */
export function getStateRegions(): RegionMetrics[] {
  return stateTreeData.flatMap(s => {
    const pop = populationData.find(p => p.region === s.state);
    if (!pop) return [];
    return [{
      region: s.state,
      level: pop.level,
      parent: pop.parent,
      population: pop.population,
      totalAreaSqKm: s.totalAreaSqKm,
      forestAreaSqKm: s.forestAreaSqKm,
      forestPercent: s.forestPercent,
      reportedTrees: s.treeCount * 1_000_000, // dataset stores millions
      source: pop.source,
      lastUpdated: pop.lastUpdated,
    }];
  });
}

export function computeAll(ratio: number): PlantationResult[] {
  return getStateRegions().map(r => computePlantation(r, ratio));
}

/** Future projection: plantation grows 5% of the current deficit each year (compounding). */
export function projectDeficit(result: PlantationResult, years: number, annualRate = 0.05) {
  const points: { year: number; deficit: number; planted: number }[] = [];
  let remaining = result.treeDeficit;
  let planted = 0;
  const thisYear = new Date().getFullYear();
  for (let y = 0; y <= years; y++) {
    points.push({ year: thisYear + y, deficit: Math.round(remaining), planted: Math.round(planted) });
    const add = remaining * annualRate;
    planted += add;
    remaining -= add;
  }
  return points;
}

/** Human-readable compact number: 1.5M, 24.3K, 1.2B */
export const fmt = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
};

export const fmtFull = (n: number) => Math.round(n).toLocaleString('en-IN');

/** Rule-based insight generator ("AI Insight Panel"). */
export function generateInsights(r: PlantationResult, all: PlantationResult[]): string[] {
  const out: string[] = [];
  const rank = [...all].sort((a, b) => b.treeDeficit - a.treeDeficit).findIndex(x => x.region === r.region) + 1;
  const treesPerPerson = r.existingTrees / r.population;

  if (r.priority === 'Critical') out.push(`🔴 ${r.region} has a critical tree deficit — roughly ${fmt(r.treeDeficit)} trees short of the benchmark.`);
  if (r.priority === 'High') out.push(`🟠 ${r.region} falls well short of the ecological benchmark and needs a prioritised plantation drive.`);
  if (r.priority === 'Moderate') out.push(`🟡 ${r.region} is moderately below the benchmark; steady annual plantation can close the gap.`);
  if (r.priority === 'Low') out.push(`🟢 The estimated green cover in ${r.region} is sufficient for the selected benchmark.`);

  out.push(`👥 Current availability is about ${treesPerPerson.toFixed(1)} trees per person against the selected benchmark.`);
  if (treesPerPerson < 1) out.push(`📉 ${r.region}'s population has grown faster than its green cover.`);
  if (r.forestPercent < 15) out.push(`🏙️ Forest cover is only ${r.forestPercent}% — plantation drives should prioritise urban districts and roadside corridors.`);
  out.push(`📊 ${r.region} ranks #${rank} of ${all.length} states by absolute tree deficit.`);
  out.push(`💡 Recommendation: ${PRIORITY_META[r.priority].action}`);
  return out;
}
