import { stateTreeData } from '@/data/treeData';

interface Props {
  selectedState: string | null;
}

/**
 * Green zone threshold: 20% forest cover.
 * For each state below 20%, we calculate how much additional forest area (and trees)
 * are needed to reach that target, based on average tree density per forest sq km.
 */
const GREEN_THRESHOLD = 20; // percent forest cover to be "green"
const AVG_TREES_PER_SQKM = 15000; // average trees per sq km of forest (estimated)

function calcTreesNeeded(s: typeof stateTreeData[0]) {
  const targetForestArea = (GREEN_THRESHOLD / 100) * s.totalAreaSqKm;
  const deficit = targetForestArea - s.forestAreaSqKm;
  if (deficit <= 0) return { deficit: 0, treesNeeded: 0, targetForestArea, currentPercent: s.forestPercent };
  const treesNeeded = Math.round(deficit * AVG_TREES_PER_SQKM);
  return { deficit: Math.round(deficit), treesNeeded, targetForestArea: Math.round(targetForestArea), currentPercent: s.forestPercent };
}

export default function PlantationSuggestions({ selectedState }: Props) {
  // Show red/yellow zone states (below green threshold) sorted by deficit
  const redZoneStates = stateTreeData
    .filter(s => s.forestPercent < GREEN_THRESHOLD)
    .map(s => ({ ...s, calc: calcTreesNeeded(s) }))
    .sort((a, b) => b.calc.treesNeeded - a.calc.treesNeeded);

  const displayData = selectedState
    ? stateTreeData
        .filter(s => s.state === selectedState)
        .map(s => ({ ...s, calc: calcTreesNeeded(s) }))
    : redZoneStates;

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-1">🌱 Trees Needed to Reach Green Zone</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Green zone = ≥{GREEN_THRESHOLD}% forest cover · Estimates based on ~{AVG_TREES_PER_SQKM.toLocaleString()} trees/km²
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-medium text-muted-foreground">State</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Current Forest %</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Target (20%)</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Area Deficit (km²)</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Trees to Plant</th>
              <th className="py-2 font-medium text-muted-foreground text-center w-40">Progress</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map(s => {
              const { deficit, treesNeeded, currentPercent } = s.calc;
              const isGreen = deficit === 0;
              const progress = Math.min(100, (currentPercent / GREEN_THRESHOLD) * 100);

              return (
                <tr key={s.state} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-medium text-foreground">{s.state}</td>
                  <td className={`py-2.5 text-right font-semibold ${isGreen ? 'text-success' : currentPercent < 10 ? 'text-destructive' : 'text-warning'}`}>
                    {currentPercent}%
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground">{GREEN_THRESHOLD}%</td>
                  <td className="py-2.5 text-right text-muted-foreground">
                    {isGreen ? '—' : deficit.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-display font-bold text-foreground">
                    {isGreen ? (
                      <span className="text-success font-semibold">✅ Already Green</span>
                    ) : (
                      <span>{formatTreeCount(treesNeeded)}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: isGreen ? 'hsl(var(--success))' : progress < 50 ? 'hsl(var(--danger))' : 'hsl(var(--warning))',
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(progress)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary for red zones */}
      {!selectedState && redZoneStates.length > 0 && (
        <div className="mt-4 p-4 rounded-lg bg-danger/5 border border-danger/20">
          <p className="text-sm font-semibold text-foreground mb-1">
            📊 Total across all red/yellow zones:
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">
              {formatTreeCount(redZoneStates.reduce((sum, s) => sum + s.calc.treesNeeded, 0))}
            </strong>{' '}
            trees need to be planted across{' '}
            <strong className="text-foreground">{redZoneStates.length} states</strong> to bring them all to ≥{GREEN_THRESHOLD}% forest cover,
            covering an additional{' '}
            <strong className="text-foreground">
              {redZoneStates.reduce((sum, s) => sum + s.calc.deficit, 0).toLocaleString()} km²
            </strong>{' '}
            of forest area.
          </p>
        </div>
      )}
    </div>
  );
}

/** Format large tree counts into readable strings */
function formatTreeCount(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}
