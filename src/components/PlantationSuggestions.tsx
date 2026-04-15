import { stateTreeData } from '@/data/treeData';

interface Props {
  selectedState: string | null;
}

export default function PlantationSuggestions({ selectedState }: Props) {
  const data = selectedState
    ? stateTreeData.filter(s => s.state === selectedState)
    : [...stateTreeData].sort((a, b) => b.suggestedPlantation - a.suggestedPlantation).slice(0, 10);

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-3">🌱 Plantation Recommendations</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-medium text-muted-foreground">State</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Forest %</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Trees Needed (M)</th>
              <th className="text-right py-2 font-medium text-muted-foreground">Priority</th>
            </tr>
          </thead>
          <tbody>
            {data.map(s => {
              const priority = s.suggestedPlantation >= 80 ? 'Critical' : s.suggestedPlantation >= 40 ? 'High' : s.suggestedPlantation >= 15 ? 'Medium' : 'Low';
              const priorityColor = priority === 'Critical' ? 'text-destructive' : priority === 'High' ? 'text-warning' : priority === 'Medium' ? 'text-info' : 'text-success';
              return (
                <tr key={s.state} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2 font-medium text-foreground">{s.state}</td>
                  <td className="py-2 text-right text-muted-foreground">{s.forestPercent}%</td>
                  <td className="py-2 text-right font-display font-bold text-foreground">{s.suggestedPlantation}</td>
                  <td className={`py-2 text-right font-semibold ${priorityColor}`}>{priority}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
