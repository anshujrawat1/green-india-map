import { useState } from 'react';
import StatsCards from '@/components/StatsCards';
import IndiaMap from '@/components/IndiaMap';
import Filters from '@/components/Filters';
import { TopStatesChart, BottomStatesChart, ForestPieChart, GrowthLineChart } from '@/components/Charts';
import InsightsPanel from '@/components/InsightsPanel';
import PlantationSuggestions from '@/components/PlantationSuggestions';
import DownloadReport from '@/components/DownloadReport';
import StateDetail from '@/components/StateDetail';
import PlantationModule from '@/components/plantation/PlantationModule';
import { Trees } from 'lucide-react';

export default function Index() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [densityRange, setDensityRange] = useState<[number, number]>([0, 45000]);

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
          <DownloadReport />
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats overview */}
        <StatsCards />

        {/* Map + Filters row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <IndiaMap selectedState={selectedState} onStateClick={setSelectedState} densityRange={densityRange} />
            {selectedState && <StateDetail state={selectedState} onClose={() => setSelectedState(null)} />}
          </div>
          <div className="space-y-4">
            <Filters
              selectedState={selectedState}
              onStateChange={setSelectedState}
              densityRange={densityRange}
              onDensityChange={setDensityRange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
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
