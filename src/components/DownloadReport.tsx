import { stateTreeData, getAggregateStats } from '@/data/treeData';
import { Download } from 'lucide-react';

export default function DownloadReport() {
  const handleDownload = () => {
    const stats = getAggregateStats();
    let csv = 'State,Total Area (km²),Forest Area (km²),Forest %,Tree Count (M),Density (trees/km²),Plantation Needed (M)\n';
    stateTreeData.forEach(s => {
      csv += `${s.state},${s.totalAreaSqKm},${s.forestAreaSqKm},${s.forestPercent},${s.treeCount},${s.treeDensity},${s.suggestedPlantation}\n`;
    });
    csv += `\nSummary\nTotal Trees (M),${stats.totalTrees}\nAvg Density,${stats.avgDensity}\nForest Cover %,${stats.forestPercent}\nPlantation Needed (M),${stats.totalPlantationNeeded}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'india_tree_coverage_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
    >
      <Download className="h-4 w-4" />
      Download Report (CSV)
    </button>
  );
}
