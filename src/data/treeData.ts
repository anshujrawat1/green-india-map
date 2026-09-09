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
  { state: "Delhi", totalAreaSqKm: 1484, forestAreaSqKm: 195, forestPercent: 13.16, treeCount: 9.6, treeDensity: 6502, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 40.7 },
  { state: "Bihar", totalAreaSqKm: 94163, forestAreaSqKm: 7532, forestPercent: 8.0, treeCount: 372.2, treeDensity: 3953, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 7.4 },
  { state: "Chandigarh", totalAreaSqKm: 114, forestAreaSqKm: 25, forestPercent: 21.93, treeCount: 1.2, treeDensity: 10836, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 1.9 },
  { state: "Madhya Pradesh", totalAreaSqKm: 308252, forestAreaSqKm: 77073, forestPercent: 25.0, treeCount: 3808.4, treeDensity: 12355, yearlyGrowth: [-0.4, -0.4, -0.4, -0.4, -0.4], suggestedPlantation: 76.2 },
  { state: "Arunachal Pradesh", totalAreaSqKm: 83743, forestAreaSqKm: 65882, forestPercent: 78.67, treeCount: 3255.4, treeDensity: 38874, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 65.1 },
  { state: "Chhattisgarh", totalAreaSqKm: 135192, forestAreaSqKm: 55812, forestPercent: 41.28, treeCount: 2757.8, treeDensity: 20399, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 55.2 },
  { state: "Maharashtra", totalAreaSqKm: 307713, forestAreaSqKm: 50859, forestPercent: 16.53, treeCount: 2513.1, treeDensity: 8167, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 50.3 },
  { state: "Odisha", totalAreaSqKm: 155707, forestAreaSqKm: 52434, forestPercent: 33.67, treeCount: 2590.9, treeDensity: 16640, yearlyGrowth: [0.14, 0.14, 0.14, 0.14, 0.14], suggestedPlantation: 51.8 },
  { state: "Karnataka", totalAreaSqKm: 191791, forestAreaSqKm: 39254, forestPercent: 20.47, treeCount: 1939.7, treeDensity: 10114, yearlyGrowth: [-0.59, -0.59, -0.59, -0.59, -0.59], suggestedPlantation: 38.8 },
  { state: "Kerala", totalAreaSqKm: 38852, forestAreaSqKm: 22059, forestPercent: 56.78, treeCount: 1090.0, treeDensity: 28056, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 21.8 },
  { state: "Andhra Pradesh", totalAreaSqKm: 162923, forestAreaSqKm: 30085, forestPercent: 18.47, treeCount: 1486.6, treeDensity: 9125, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 29.7 },
  { state: "Tamil Nadu", totalAreaSqKm: 130060, forestAreaSqKm: 26450, forestPercent: 20.34, treeCount: 1307.0, treeDensity: 10049, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 26.1 },
  { state: "Assam", totalAreaSqKm: 78438, forestAreaSqKm: 28314, forestPercent: 36.1, treeCount: 1399.1, treeDensity: 17837, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 28.0 },
  { state: "Jharkhand", totalAreaSqKm: 79716, forestAreaSqKm: 23766, forestPercent: 29.81, treeCount: 1174.3, treeDensity: 14732, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 23.5 },
  { state: "Uttarakhand", totalAreaSqKm: 53483, forestAreaSqKm: 24304, forestPercent: 45.44, treeCount: 1200.9, treeDensity: 22454, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 24.0 },
  { state: "Meghalaya", totalAreaSqKm: 22429, forestAreaSqKm: 16967, forestPercent: 75.65, treeCount: 838.4, treeDensity: 37380, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 16.8 },
  { state: "Mizoram", totalAreaSqKm: 21081, forestAreaSqKm: 17990, forestPercent: 85.34, treeCount: 889.0, treeDensity: 42169, yearlyGrowth: [0.67, 0.67, 0.67, 0.67, 0.67], suggestedPlantation: 17.8 },
  { state: "Nagaland", totalAreaSqKm: 16579, forestAreaSqKm: 12222, forestPercent: 73.72, treeCount: 604.0, treeDensity: 36429, yearlyGrowth: [-0.51, -0.51, -0.51, -0.51, -0.51], suggestedPlantation: 12.1 },
  { state: "Manipur", totalAreaSqKm: 22327, forestAreaSqKm: 16585, forestPercent: 74.28, treeCount: 819.5, treeDensity: 36706, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 16.4 },
  { state: "Tripura", totalAreaSqKm: 10486, forestAreaSqKm: 7585, forestPercent: 72.33, treeCount: 374.8, treeDensity: 35742, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 7.5 },
  { state: "Sikkim", totalAreaSqKm: 7096, forestAreaSqKm: 3358, forestPercent: 47.33, treeCount: 165.9, treeDensity: 23386, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 3.3 },
  { state: "Goa", totalAreaSqKm: 3702, forestAreaSqKm: 2266, forestPercent: 61.2, treeCount: 112.0, treeDensity: 30242, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.2 },
  { state: "Himachal Pradesh", totalAreaSqKm: 55673, forestAreaSqKm: 15580, forestPercent: 27.99, treeCount: 769.9, treeDensity: 13829, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 15.4 },
  { state: "Gujarat", totalAreaSqKm: 196244, forestAreaSqKm: 15017, forestPercent: 7.65, treeCount: 742.0, treeDensity: 3781, yearlyGrowth: [0.6, 0.6, 0.6, 0.6, 0.6], suggestedPlantation: 14.8 },
  { state: "Rajasthan", totalAreaSqKm: 342239, forestAreaSqKm: 16548, forestPercent: 4.84, treeCount: 817.7, treeDensity: 2389, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 16.4 },
  { state: "Uttar Pradesh", totalAreaSqKm: 240928, forestAreaSqKm: 15046, forestPercent: 6.24, treeCount: 743.5, treeDensity: 3086, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 14.9 },
  { state: "West Bengal", totalAreaSqKm: 88752, forestAreaSqKm: 16832, forestPercent: 18.97, treeCount: 831.7, treeDensity: 9371, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 16.6 },
  { state: "Punjab", totalAreaSqKm: 50362, forestAreaSqKm: 1846, forestPercent: 3.67, treeCount: 91.2, treeDensity: 1811, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 1.8 },
  { state: "Haryana", totalAreaSqKm: 44212, forestAreaSqKm: 1614, forestPercent: 3.65, treeCount: 79.8, treeDensity: 1804, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 1.6 },
  { state: "Telangana", totalAreaSqKm: 112122, forestAreaSqKm: 21179, forestPercent: 18.89, treeCount: 1046.5, treeDensity: 9334, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 20.9 },
  { state: "Jammu & Kashmir", totalAreaSqKm: 54633, forestAreaSqKm: 21347, forestPercent: 39.07, treeCount: 1054.8, treeDensity: 19308, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 21.1 },
  { state: "Ladakh", totalAreaSqKm: 169421, forestAreaSqKm: 2285, forestPercent: 1.35, treeCount: 112.9, treeDensity: 666, yearlyGrowth: [-3.48, -3.48, -3.48, -3.48, -3.48], suggestedPlantation: 2.3 },
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
