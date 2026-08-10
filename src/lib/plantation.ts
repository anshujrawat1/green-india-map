/**
 * Core population-based plantation logic.
 * Level-agnostic: works for country / state / district / city / ward as long as the
 * caller supplies a `RegionMetrics` object. No UI or state-specific assumptions here.
 */
import { stateTreeData } from '@/data/treeData';
import { populationData, RegionLevel } from '@/data/populationData';

/** Average trees per hectare used when an actual tree count is unavailable. */
export const AVG_TREES_PER_HECTARE = 400;

/** Fixed project benchmark: every person should have 3 trees. */
export const BENCHMARK = 3;
export const DEFAULT_RATIO = BENCHMARK;

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
  surplus: number;
  treesPerPerson: number;
  achievementPercent: number;
  /** deficit as % of required trees (0-100) */
  deficitPercent: number;
  priority: Priority;
}

export type Priority = 'Target Met' | 'Low' | 'Moderate' | 'High' | 'Critical';

export const PRIORITY_ORDER: Priority[] = ['Target Met', 'Low', 'Moderate', 'High', 'Critical'];

export const PRIORITY_META: Record<Priority, { color: string; emoji: string; range: string; action: string }> = {
  'Target Met': { color: '#065f46', emoji: '✅', range: '0%', action: 'Benchmark met — maintain existing green cover.' },
  Low: { color: '#84cc16', emoji: '🟢', range: '0–25%', action: 'Small gap — sustain current plantation pace.' },
  Moderate: { color: '#fbbf24', emoji: '🟡', range: '25–50%', action: 'Increase annual plantation programmes.' },
  High: { color: '#f97316', emoji: '🟠', range: '50–75%', action: 'Prioritise urban green corridors.' },
  Critical: { color: '#ef4444', emoji: '🔴', range: '75–100%', action: 'Immediate large-scale plantation required.' },
};

/** Priority is derived ONLY from the population-based deficit %. */
export const getPriority = (deficitPercent: number): Priority => {
  if (deficitPercent <= 0) return 'Target Met';
  if (deficitPercent <= 25) return 'Low';
  if (deficitPercent <= 50) return 'Moderate';
  if (deficitPercent <= 75) return 'High';
  return 'Critical';
};

/** Deficit-based map / chart color scale (matches the priority bands). */
export const getDeficitColor = (deficitPercent: number): string =>
  PRIORITY_META[getPriority(deficitPercent)].color;

/** Estimate existing trees from forest area when a reported count is missing. */
export const estimateTreesFromForest = (forestAreaSqKm: number) =>
  forestAreaSqKm * 100 * AVG_TREES_PER_HECTARE; // 1 km² = 100 ha

/** Pure calculation — the single source of truth for every level of the hierarchy. */
export function computePlantation(metrics: RegionMetrics, ratio: number = BENCHMARK): PlantationResult {
  const estimated = metrics.reportedTrees == null;
  const existingTrees = estimated
    ? estimateTreesFromForest(metrics.forestAreaSqKm)
    : (metrics.reportedTrees as number);
  const requiredTrees = metrics.population * ratio;
  const treeDeficit = Math.max(0, requiredTrees - existingTrees);
  const surplus = Math.max(0, existingTrees - requiredTrees);
  const deficitPercent = requiredTrees > 0 ? (treeDeficit / requiredTrees) * 100 : 0;
  const achievementPercent = requiredTrees > 0 ? (existingTrees / requiredTrees) * 100 : 0;
  const treesPerPerson = metrics.population > 0 ? existingTrees / metrics.population : 0;
  return {
    ...metrics,
    existingTrees,
    estimated,
    requiredTrees,
    treeDeficit,
    surplus,
    treesPerPerson,
    achievementPercent,
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

export function computeAll(ratio: number = BENCHMARK): PlantationResult[] {
  return getStateRegions().map(r => computePlantation(r, ratio));
}

/**
 * Scenario simulation: the user supplies an absolute number of trees planted each year.
 * No assumed rate — purely `deficit - (annualPlanted * year)`, floored at zero.
 */
export function simulateScenario(result: PlantationResult, annualPlanted: number, years: number) {
  const points: { year: number; deficit: number; planted: number }[] = [];
  const thisYear = new Date().getFullYear();
  for (let y = 0; y <= years; y++) {
    const planted = Math.min(annualPlanted * y, result.treeDeficit);
    points.push({ year: thisYear + y, deficit: Math.round(result.treeDeficit - planted), planted: Math.round(planted) });
  }
  return points;
}

/** Years needed to fully close the deficit at a given annual plantation rate. */
export const yearsToClose = (deficit: number, annualPlanted: number) =>
  annualPlanted > 0 ? Math.ceil(deficit / annualPlanted) : Infinity;

/** Human-readable compact number: 1.5M, 24.3K, 1.2B */
export const fmt = (n: number) => {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
};

export const fmtFull = (n: number) => Math.round(n).toLocaleString('en-IN');

/** Rule-based, fully deterministic insight generator ("Automated Insights"). */
export function generateInsights(r: PlantationResult, all: PlantationResult[]): string[] {
  const rank = [...all].sort((a, b) => b.treeDeficit - a.treeDeficit).findIndex(x => x.region === r.region) + 1;
  const out: string[] = [
    `👥 ${r.region} currently has ${r.treesPerPerson.toFixed(2)} trees per person against the project benchmark of ${BENCHMARK} trees per person.`,
    `🎯 ${r.region} requires ${fmt(r.requiredTrees)} trees based on a population of ${fmt(r.population)}.`,
    `🌳 ${r.region} currently has ${fmt(r.existingTrees)} existing trees.`,
  ];
  if (r.treeDeficit > 0) {
    out.push(`📉 ${r.region} has a tree deficit of ${fmt(r.treeDeficit)}.`);
    out.push(`📊 ${r.region} has a ${r.deficitPercent.toFixed(2)}% deficit against the ${BENCHMARK} trees/person benchmark.`);
  } else {
    out.push(`✅ ${r.region} has met the benchmark with a surplus of ${fmt(r.surplus)} trees.`);
  }
  out.push(`🏅 Target achievement is ${r.achievementPercent.toFixed(2)}% of the required trees.`);
  out.push(`🚦 ${r.region} is classified as ${r.priority}${r.priority === 'Target Met' ? '' : ' Priority'}.`);
  out.push(`📈 ${r.region} ranks #${rank} of ${all.length} states by absolute tree deficit.`);
  out.push(`🌲 Separately, forest cover in ${r.region} is ${r.forestPercent}% (environmental metric — not used in this calculation).`);
  out.push(`💡 Recommendation: ${PRIORITY_META[r.priority].action}`);
  return out;
}
