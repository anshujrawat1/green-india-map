import { useCallback, useMemo, useState } from 'react';
import StatsCards from '@/components/StatsCards';
import IndiaMap from '@/components/IndiaMap';
import Filters, { defaultFilters, FilterState } from '@/components/Filters';
import StateList, { StateRow } from '@/components/StateList';
import { TopStatesChart, BottomStatesChart, ForestPieChart, GrowthLineChart } from '@/components/Charts';
import InsightsPanel from '@/components/InsightsPanel';
import PlantationSuggestions from '@/components/PlantationSuggestions';
import DownloadReport from '@/components/DownloadReport';
import StateDetail from '@/components/StateDetail';
import PlantationModule from '@/components/plantation/PlantationModule';
import { stateTreeData } from '@/data/treeData';
import { computeAll } from '@/lib/plantation';
import { Link } from 'react-router-dom';
import { Trees, ClipboardList } from 'lucide-react';

export default function Index() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const metricsByState = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeAll>[number]> = {};
    computeAll().forEach(m => { map[m.region] = m; });
    return map;
  }, []);

  const rows: StateRow[] = useMemo(() => {
    const list = stateTreeData
      .map(data => ({ data, metrics: metricsByState[data.state] }))
      .filter(({ data, metrics }) =>
        data.treeDensity >= filters.densityRange[0] &&
        data.treeDensity <= filters.densityRange[1] &&
        data.forestPercent >= filters.forestRange[0] &&
        data.forestPercent <= filters.forestRange[1] &&
        (filters.priorities.length === 0 || (metrics && filters.priorities.includes(metrics.priority)))
      );
    const sorters: Record<FilterState['sortKey'], (a: StateRow, b: StateRow) => number> = {
      name: (a, b) => a.data.state.localeCompare(b.data.state),
      forest: (a, b) => b.data.forestPercent - a.data.forestPercent,
      density: (a, b) => b.data.treeDensity - a.data.treeDensity,
      trees: (a, b) => b.data.treeCount - a.data.treeCount,
      deficit: (a, b) => (b.metrics?.treeDeficit ?? 0) - (a.metrics?.treeDeficit ?? 0),
    };
    return list.sort(sorters[filters.sortKey]);
  }, [filters, metricsByState]);

  const handleSelect = useCallback((state: string | null) => setSelectedState(state), []);
  const handleHover = useCallback((state: string | null) => setHoveredState(state), []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Trees className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">India Tree Coverage Dashboard</h1>
              <p className="text-xs text-muted-foreground">Visualizing forest density & plantation needs across India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/plan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <ClipboardList className="h-4 w-4" /> Plantation Plan
            </Link>
            <DownloadReport />
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats overview */}
        <StatsCards />

        {/* Map + Filters row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <IndiaMap
              rows={rows}
              selectedState={selectedState}
              hoveredState={hoveredState}
              colorMode={filters.colorMode}
              onStateClick={handleSelect}
              onStateHover={handleHover}
            />
            {selectedState && <StateDetail state={selectedState} onClose={() => setSelectedState(null)} />}
            <StateList
              rows={rows}
              selectedState={selectedState}
              hoveredState={hoveredState}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          </div>
          <div className="space-y-4">
            <Filters
              selectedState={selectedState}
              onStateChange={setSelectedState}
              filters={filters}
              onChange={setFilters}
              matchCount={rows.length}
            />
            <InsightsPanel />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopStatesChart />
          <BottomStatesChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ForestPieChart />
          <GrowthLineChart />
        </div>

        {/* Plantation suggestions */}
        <PlantationSuggestions selectedState={selectedState} />

        {/* Population-based tree requirement & plantation priority */}
        <PlantationModule />

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
          Data based on India State of Forest Report (ISFR) estimates · Built with React + Leaflet + Recharts
        </footer>
      </main>
    </div>
  );
}
