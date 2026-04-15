/**
 * Realistic sample dataset of tree coverage across Indian states.
 * Sources: Approximate values inspired by India State of Forest Report (ISFR).
 * - forestAreaSqKm: Approximate forest cover in sq km
 * - totalAreaSqKm: Total geographic area
 * - treeDensity: Trees per sq km (estimated)
 * - forestPercent: Forest cover as % of total area
 */

export interface StateTreeData {
  state: string;
  totalAreaSqKm: number;
  forestAreaSqKm: number;
  forestPercent: number;
  treeCount: number; // in millions
  treeDensity: number; // trees per sq km
  yearlyGrowth: number[]; // last 5 years growth %
  suggestedPlantation: number; // millions of trees needed
}

export const stateTreeData: StateTreeData[] = [
  { state: "Madhya Pradesh", totalAreaSqKm: 308252, forestAreaSqKm: 77482, forestPercent: 25.14, treeCount: 3200, treeDensity: 10381, yearlyGrowth: [1.2, 1.5, 1.1, 1.8, 2.0], suggestedPlantation: 50 },
  { state: "Arunachal Pradesh", totalAreaSqKm: 83743, forestAreaSqKm: 66688, forestPercent: 79.63, treeCount: 2800, treeDensity: 33432, yearlyGrowth: [0.5, 0.3, 0.8, 0.4, 0.6], suggestedPlantation: 5 },
  { state: "Chhattisgarh", totalAreaSqKm: 135194, forestAreaSqKm: 55611, forestPercent: 41.13, treeCount: 2400, treeDensity: 17752, yearlyGrowth: [1.0, 1.2, 1.4, 1.1, 1.3], suggestedPlantation: 30 },
  { state: "Maharashtra", totalAreaSqKm: 307713, forestAreaSqKm: 50778, forestPercent: 16.50, treeCount: 2100, treeDensity: 6824, yearlyGrowth: [0.8, 1.0, 0.9, 1.2, 1.1], suggestedPlantation: 80 },
  { state: "Odisha", totalAreaSqKm: 155707, forestAreaSqKm: 51619, forestPercent: 33.15, treeCount: 2000, treeDensity: 12845, yearlyGrowth: [1.1, 1.3, 1.0, 1.5, 1.2], suggestedPlantation: 35 },
  { state: "Karnataka", totalAreaSqKm: 191791, forestAreaSqKm: 38575, forestPercent: 20.11, treeCount: 1600, treeDensity: 8341, yearlyGrowth: [0.9, 1.1, 1.3, 1.0, 1.4], suggestedPlantation: 55 },
  { state: "Kerala", totalAreaSqKm: 38863, forestAreaSqKm: 21144, forestPercent: 54.42, treeCount: 1400, treeDensity: 36032, yearlyGrowth: [0.7, 0.9, 0.6, 0.8, 1.0], suggestedPlantation: 10 },
  { state: "Andhra Pradesh", totalAreaSqKm: 162975, forestAreaSqKm: 28147, forestPercent: 17.27, treeCount: 1300, treeDensity: 7978, yearlyGrowth: [1.0, 0.8, 1.2, 1.1, 1.3], suggestedPlantation: 60 },
  { state: "Tamil Nadu", totalAreaSqKm: 130060, forestAreaSqKm: 26419, forestPercent: 20.31, treeCount: 1200, treeDensity: 9226, yearlyGrowth: [0.6, 0.8, 1.0, 0.7, 0.9], suggestedPlantation: 45 },
  { state: "Assam", totalAreaSqKm: 78438, forestAreaSqKm: 28312, forestPercent: 36.09, treeCount: 1100, treeDensity: 14022, yearlyGrowth: [0.4, 0.6, 0.5, 0.7, 0.8], suggestedPlantation: 20 },
  { state: "Jharkhand", totalAreaSqKm: 79716, forestAreaSqKm: 23605, forestPercent: 29.61, treeCount: 950, treeDensity: 11922, yearlyGrowth: [0.8, 1.0, 0.9, 1.1, 1.2], suggestedPlantation: 25 },
  { state: "Uttarakhand", totalAreaSqKm: 53483, forestAreaSqKm: 24305, forestPercent: 45.44, treeCount: 900, treeDensity: 16828, yearlyGrowth: [1.0, 1.2, 0.8, 1.1, 1.3], suggestedPlantation: 15 },
  { state: "Meghalaya", totalAreaSqKm: 22429, forestAreaSqKm: 17146, forestPercent: 76.44, treeCount: 800, treeDensity: 35672, yearlyGrowth: [0.3, 0.5, 0.4, 0.6, 0.7], suggestedPlantation: 3 },
  { state: "Mizoram", totalAreaSqKm: 21081, forestAreaSqKm: 18186, forestPercent: 86.27, treeCount: 780, treeDensity: 37003, yearlyGrowth: [0.2, 0.4, 0.3, 0.5, 0.6], suggestedPlantation: 2 },
  { state: "Nagaland", totalAreaSqKm: 16579, forestAreaSqKm: 12489, forestPercent: 75.33, treeCount: 650, treeDensity: 39209, yearlyGrowth: [0.3, 0.5, 0.4, 0.6, 0.5], suggestedPlantation: 4 },
  { state: "Manipur", totalAreaSqKm: 22327, forestAreaSqKm: 16847, forestPercent: 75.46, treeCount: 620, treeDensity: 27770, yearlyGrowth: [0.4, 0.3, 0.5, 0.6, 0.7], suggestedPlantation: 5 },
  { state: "Tripura", totalAreaSqKm: 10486, forestAreaSqKm: 7726, forestPercent: 73.68, treeCount: 400, treeDensity: 38146, yearlyGrowth: [0.5, 0.7, 0.6, 0.8, 0.9], suggestedPlantation: 3 },
  { state: "Sikkim", totalAreaSqKm: 7096, forestAreaSqKm: 3341, forestPercent: 47.08, treeCount: 200, treeDensity: 28182, yearlyGrowth: [0.6, 0.8, 0.7, 0.9, 1.0], suggestedPlantation: 2 },
  { state: "Goa", totalAreaSqKm: 3702, forestAreaSqKm: 2237, forestPercent: 60.43, treeCount: 150, treeDensity: 40519, yearlyGrowth: [0.5, 0.3, 0.4, 0.6, 0.7], suggestedPlantation: 1 },
  { state: "Himachal Pradesh", totalAreaSqKm: 55673, forestAreaSqKm: 15434, forestPercent: 27.72, treeCount: 700, treeDensity: 12574, yearlyGrowth: [0.8, 1.0, 0.9, 1.1, 1.2], suggestedPlantation: 18 },
  { state: "Gujarat", totalAreaSqKm: 196024, forestAreaSqKm: 14857, forestPercent: 7.58, treeCount: 800, treeDensity: 4081, yearlyGrowth: [1.5, 1.8, 1.3, 2.0, 1.7], suggestedPlantation: 90 },
  { state: "Rajasthan", totalAreaSqKm: 342239, forestAreaSqKm: 16572, forestPercent: 4.84, treeCount: 600, treeDensity: 1753, yearlyGrowth: [2.0, 2.5, 1.8, 2.2, 2.8], suggestedPlantation: 150 },
  { state: "Uttar Pradesh", totalAreaSqKm: 240928, forestAreaSqKm: 14806, forestPercent: 6.15, treeCount: 900, treeDensity: 3735, yearlyGrowth: [1.2, 1.5, 1.0, 1.8, 1.4], suggestedPlantation: 120 },
  { state: "Bihar", totalAreaSqKm: 94163, forestAreaSqKm: 7288, forestPercent: 7.74, treeCount: 350, treeDensity: 3717, yearlyGrowth: [1.8, 2.0, 1.5, 2.2, 1.9], suggestedPlantation: 70 },
  { state: "West Bengal", totalAreaSqKm: 88752, forestAreaSqKm: 16847, forestPercent: 18.98, treeCount: 750, treeDensity: 8451, yearlyGrowth: [0.7, 0.9, 0.8, 1.0, 1.1], suggestedPlantation: 40 },
  { state: "Punjab", totalAreaSqKm: 50362, forestAreaSqKm: 1849, forestPercent: 3.67, treeCount: 200, treeDensity: 3971, yearlyGrowth: [2.5, 3.0, 2.2, 2.8, 3.2], suggestedPlantation: 60 },
  { state: "Haryana", totalAreaSqKm: 44212, forestAreaSqKm: 1584, forestPercent: 3.58, treeCount: 180, treeDensity: 4071, yearlyGrowth: [2.8, 3.2, 2.5, 3.0, 3.5], suggestedPlantation: 55 },
  { state: "Telangana", totalAreaSqKm: 112077, forestAreaSqKm: 20419, forestPercent: 18.22, treeCount: 850, treeDensity: 7585, yearlyGrowth: [1.0, 1.2, 0.9, 1.3, 1.1], suggestedPlantation: 45 },
  { state: "Jammu & Kashmir", totalAreaSqKm: 42241, forestAreaSqKm: 10259, forestPercent: 24.29, treeCount: 500, treeDensity: 11837, yearlyGrowth: [0.5, 0.7, 0.6, 0.8, 0.9], suggestedPlantation: 20 },
  { state: "Delhi", totalAreaSqKm: 1484, forestAreaSqKm: 195, forestPercent: 13.14, treeCount: 15, treeDensity: 10108, yearlyGrowth: [3.0, 3.5, 2.8, 3.2, 4.0], suggestedPlantation: 25 },
  { state: "Ladakh", totalAreaSqKm: 59146, forestAreaSqKm: 1394, forestPercent: 2.36, treeCount: 20, treeDensity: 338, yearlyGrowth: [0.1, 0.2, 0.1, 0.3, 0.2], suggestedPlantation: 10 },
  { state: "Chandigarh", totalAreaSqKm: 114, forestAreaSqKm: 22, forestPercent: 19.30, treeCount: 2, treeDensity: 17544, yearlyGrowth: [1.5, 1.8, 1.2, 2.0, 1.7], suggestedPlantation: 1 },
];

/** Aggregate stats */
export const getAggregateStats = () => {
  const totalTrees = stateTreeData.reduce((sum, s) => sum + s.treeCount, 0);
  const totalArea = stateTreeData.reduce((sum, s) => sum + s.totalAreaSqKm, 0);
  const totalForestArea = stateTreeData.reduce((sum, s) => sum + s.forestAreaSqKm, 0);
  const avgDensity = Math.round(stateTreeData.reduce((sum, s) => sum + s.treeDensity, 0) / stateTreeData.length);
  const totalPlantationNeeded = stateTreeData.reduce((sum, s) => sum + s.suggestedPlantation, 0);
  const forestPercent = ((totalForestArea / totalArea) * 100).toFixed(1);

  return { totalTrees, totalArea, totalForestArea, avgDensity, totalPlantationNeeded, forestPercent };
};

/** Get color based on forest percentage */
export const getForestColor = (percent: number): string => {
  if (percent >= 70) return '#065f46'; // very dense
  if (percent >= 40) return '#059669'; // dense
  if (percent >= 20) return '#34d399'; // moderate
  if (percent >= 10) return '#fbbf24'; // low
  return '#ef4444'; // very low - needs plantation
};

/** Top N states by density */
export const getTopStates = (n: number) =>
  [...stateTreeData].sort((a, b) => b.treeDensity - a.treeDensity).slice(0, n);

/** Bottom N states by density */
export const getBottomStates = (n: number) =>
  [...stateTreeData].sort((a, b) => a.treeDensity - b.treeDensity).slice(0, n);

/** Year labels for growth chart */
export const yearLabels = ['2020', '2021', '2022', '2023', '2024'];

/** Insights */
export const getInsights = (): string[] => {
  const sorted = [...stateTreeData].sort((a, b) => a.forestPercent - b.forestPercent);
  const highest = [...stateTreeData].sort((a, b) => b.forestPercent - a.forestPercent)[0];
  return [
    `🌳 ${highest.state} has the highest forest cover at ${highest.forestPercent}%`,
    `🏙️ ${sorted[0].state} has the lowest forest cover (${sorted[0].forestPercent}%) — urgent plantation needed`,
    `⚠️ Delhi needs ${stateTreeData.find(s => s.state === 'Delhi')?.suggestedPlantation}M more trees to reach adequate coverage`,
    `🌿 Northeast India (Mizoram, Meghalaya, Nagaland) has the highest tree density in the country`,
    `📈 Rajasthan and Haryana show the fastest year-over-year afforestation growth`,
  ];
};
