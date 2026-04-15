import { getInsights } from '@/data/treeData';

export default function InsightsPanel() {
  const insights = getInsights();
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="font-display font-bold text-foreground mb-3">💡 Key Insights</h3>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="text-sm text-foreground bg-accent/50 rounded-md px-3 py-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}
