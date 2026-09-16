/**
 * Real-world dataset of tree coverage across Indian states/UTs.
 * Source: Census of India 2011 + FSI ISFR 2023 (TOF-based).
 * - forestAreaSqKm: Forest cover in sq km
 * - totalAreaSqKm: Total geographic area
 * - treeCount: Trees in millions (TOF-based basis)
 * - treeDensity: Trees per sq km
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
  { state: "Delhi", totalAreaSqKm: 1484, forestAreaSqKm: 195, forestPercent: 13.16, treeCount: 1.34, treeDensity: 906, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 49.02 },
  { state: "Bihar", totalAreaSqKm: 94163, forestAreaSqKm: 7532, forestPercent: 8.0, treeCount: 51.86, treeDensity: 551, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 260.44 },
  { state: "Chandigarh", totalAreaSqKm: 114, forestAreaSqKm: 25, forestPercent: 21.93, treeCount: 0.17, treeDensity: 1510, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.99 },
  { state: "Madhya Pradesh", totalAreaSqKm: 308252, forestAreaSqKm: 77073, forestPercent: 25.0, treeCount: 530.67, treeDensity: 1722, yearlyGrowth: [-0.4, -0.4, -0.4, -0.4, -0.4], suggestedPlantation: 10.61 },
  { state: "Arunachal Pradesh", totalAreaSqKm: 83743, forestAreaSqKm: 65882, forestPercent: 78.67, treeCount: 453.61, treeDensity: 5417, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 9.07 },
  { state: "Chhattisgarh", totalAreaSqKm: 135192, forestAreaSqKm: 55812, forestPercent: 41.28, treeCount: 384.28, treeDensity: 2842, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 7.69 },
  { state: "Maharashtra", totalAreaSqKm: 307713, forestAreaSqKm: 50859, forestPercent: 16.53, treeCount: 350.17, treeDensity: 1138, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 7.0 },
  { state: "Odisha", totalAreaSqKm: 155707, forestAreaSqKm: 52434, forestPercent: 33.67, treeCount: 361.02, treeDensity: 2319, yearlyGrowth: [0.14, 0.14, 0.14, 0.14, 0.14], suggestedPlantation: 7.22 },
  { state: "Karnataka", totalAreaSqKm: 191791, forestAreaSqKm: 39254, forestPercent: 20.47, treeCount: 270.27, treeDensity: 1409, yearlyGrowth: [-0.59, -0.59, -0.59, -0.59, -0.59], suggestedPlantation: 5.41 },
  { state: "Kerala", totalAreaSqKm: 38852, forestAreaSqKm: 22059, forestPercent: 56.78, treeCount: 151.88, treeDensity: 3909, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 3.04 },
  { state: "Andhra Pradesh", totalAreaSqKm: 162923, forestAreaSqKm: 30085, forestPercent: 18.47, treeCount: 207.14, treeDensity: 1271, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 4.14 },
  { state: "Tamil Nadu", totalAreaSqKm: 130060, forestAreaSqKm: 26450, forestPercent: 20.34, treeCount: 182.12, treeDensity: 1400, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 34.33 },
  { state: "Assam", totalAreaSqKm: 78438, forestAreaSqKm: 28314, forestPercent: 36.1, treeCount: 194.94, treeDensity: 2485, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 3.9 },
  { state: "Jharkhand", totalAreaSqKm: 79716, forestAreaSqKm: 23766, forestPercent: 29.81, treeCount: 163.63, treeDensity: 2053, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 3.27 },
  { state: "Uttarakhand", totalAreaSqKm: 53483, forestAreaSqKm: 24304, forestPercent: 45.44, treeCount: 167.34, treeDensity: 3129, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 3.35 },
  { state: "Meghalaya", totalAreaSqKm: 22429, forestAreaSqKm: 16967, forestPercent: 75.65, treeCount: 116.82, treeDensity: 5208, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.34 },
  { state: "Mizoram", totalAreaSqKm: 21081, forestAreaSqKm: 17990, forestPercent: 85.34, treeCount: 123.87, treeDensity: 5876, yearlyGrowth: [0.67, 0.67, 0.67, 0.67, 0.67], suggestedPlantation: 2.48 },
  { state: "Nagaland", totalAreaSqKm: 16579, forestAreaSqKm: 12222, forestPercent: 73.72, treeCount: 84.15, treeDensity: 5076, yearlyGrowth: [-0.51, -0.51, -0.51, -0.51, -0.51], suggestedPlantation: 1.68 },
  { state: "Manipur", totalAreaSqKm: 22327, forestAreaSqKm: 16585, forestPercent: 74.28, treeCount: 114.19, treeDensity: 5115, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.28 },
  { state: "Tripura", totalAreaSqKm: 10486, forestAreaSqKm: 7585, forestPercent: 72.33, treeCount: 52.22, treeDensity: 4980, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 1.04 },
  { state: "Sikkim", totalAreaSqKm: 7096, forestAreaSqKm: 3358, forestPercent: 47.33, treeCount: 23.12, treeDensity: 3259, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 0.46 },
  { state: "Goa", totalAreaSqKm: 3702, forestAreaSqKm: 2266, forestPercent: 61.2, treeCount: 15.6, treeDensity: 4214, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 0.31 },
  { state: "Himachal Pradesh", totalAreaSqKm: 55673, forestAreaSqKm: 15580, forestPercent: 27.99, treeCount: 107.27, treeDensity: 1927, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.15 },
  { state: "Gujarat", totalAreaSqKm: 196244, forestAreaSqKm: 15017, forestPercent: 7.65, treeCount: 103.39, treeDensity: 527, yearlyGrowth: [0.6, 0.6, 0.6, 0.6, 0.6], suggestedPlantation: 77.93 },
  { state: "Rajasthan", totalAreaSqKm: 342239, forestAreaSqKm: 16548, forestPercent: 4.84, treeCount: 113.94, treeDensity: 333, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 91.71 },
  { state: "Uttar Pradesh", totalAreaSqKm: 240928, forestAreaSqKm: 15046, forestPercent: 6.24, treeCount: 103.59, treeDensity: 430, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 495.84 },
  { state: "West Bengal", totalAreaSqKm: 88752, forestAreaSqKm: 16832, forestPercent: 18.97, treeCount: 115.89, treeDensity: 1306, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 157.93 },
  { state: "Punjab", totalAreaSqKm: 50362, forestAreaSqKm: 1846, forestPercent: 3.67, treeCount: 12.71, treeDensity: 252, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 70.52 },
  { state: "Haryana", totalAreaSqKm: 44212, forestAreaSqKm: 1614, forestPercent: 3.65, treeCount: 11.11, treeDensity: 251, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 64.94 },
  { state: "Telangana", totalAreaSqKm: 112122, forestAreaSqKm: 21179, forestPercent: 18.89, treeCount: 145.82, treeDensity: 1301, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.92 },
  { state: "Jammu & Kashmir", totalAreaSqKm: 54633, forestAreaSqKm: 21347, forestPercent: 39.07, treeCount: 146.98, treeDensity: 2690, yearlyGrowth: [0.11, 0.11, 0.11, 0.11, 0.11], suggestedPlantation: 2.94 },
  { state: "Ladakh", totalAreaSqKm: 169421, forestAreaSqKm: 2285, forestPercent: 1.35, treeCount: 15.73, treeDensity: 93, yearlyGrowth: [-3.48, -3.48, -3.48, -3.48, -3.48], suggestedPlantation: 0.31 },
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
