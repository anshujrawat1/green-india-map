/**
 * Population dataset (Census 2011 with Telangana/Ladakh disaggregated, absolute persons).
 * Designed to be hierarchy-ready: Country > State > District > City > Ward.
 * Any level only needs { region, level, parent?, population, source, lastUpdated } to reuse the
 * plantation calculation logic in `src/lib/plantation.ts`.
 */

export type RegionLevel = 'country' | 'state' | 'district' | 'city' | 'ward';

export interface PopulationRecord {
  region: string;          // matches StateTreeData.state today, any region name later
  level: RegionLevel;
  parent?: string;         // parent region name (e.g. "India")
  population: number;      // persons
  source: string;
  lastUpdated: string;
}

export const POPULATION_SOURCE = 'Census of India 2011 + FSI ISFR 2023 (TOF-based)';
export const POPULATION_UPDATED = 'Sep 2026';

const raw: Record<string, number> = {
  "Delhi": 16787941,
  "Bihar": 104099452,
  "Chandigarh": 1055450,
  "Madhya Pradesh": 72626809,
  "Arunachal Pradesh": 1383727,
  "Chhattisgarh": 25545198,
  "Maharashtra": 112374333,
  "Odisha": 41974218,
  "Karnataka": 61095297,
  "Kerala": 33406061,
  "Andhra Pradesh": 49577103,
  "Tamil Nadu": 72147030,
  "Assam": 31205576,
  "Jharkhand": 32988134,
  "Uttarakhand": 10086292,
  "Meghalaya": 2966889,
  "Mizoram": 1097206,
  "Nagaland": 1978502,
  "Manipur": 2855794,
  "Tripura": 3673917,
  "Sikkim": 610577,
  "Goa": 1458545,
  "Himachal Pradesh": 6864602,
  "Gujarat": 60439692,
  "Rajasthan": 68548437,
  "Uttar Pradesh": 199812341,
  "West Bengal": 91276115,
  "Punjab": 27743338,
  "Haryana": 25351462,
  "Telangana": 35003674,
  "Jammu & Kashmir": 12267013,
  "Ladakh": 274289,
};

export const populationData: PopulationRecord[] = Object.entries(raw).map(([region, population]) => ({
  region,
  level: 'state' as RegionLevel,
  parent: 'India',
  population,
  source: POPULATION_SOURCE,
  lastUpdated: POPULATION_UPDATED,
}));

export const getPopulation = (region: string) =>
  populationData.find(p => p.region === region);
