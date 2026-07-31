/**
 * Population dataset (Census 2011 projected to 2025 estimates, in absolute persons).
 * Designed to be hierarchy-ready: Country > State > District > City > Ward.
 * Any level only needs { id, name, level, parentId?, population, ... } to reuse the
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

export const POPULATION_SOURCE = 'Census of India 2011 · UIDAI projections (2025 est.)';
export const POPULATION_UPDATED = 'Jan 2025';

const raw: Record<string, number> = {
  "Uttar Pradesh": 241000000, "Bihar": 128500000, "Maharashtra": 126400000,
  "West Bengal": 101200000, "Madhya Pradesh": 87300000, "Rajasthan": 81800000,
  "Tamil Nadu": 77000000, "Karnataka": 68600000, "Gujarat": 71500000,
  "Andhra Pradesh": 53900000, "Odisha": 46800000, "Telangana": 38200000,
  "Kerala": 35700000, "Jharkhand": 40100000, "Assam": 35900000,
  "Punjab": 31000000, "Chhattisgarh": 30500000, "Haryana": 30300000,
  "Delhi": 21500000, "Jammu & Kashmir": 13800000, "Uttarakhand": 11800000,
  "Himachal Pradesh": 7500000, "Tripura": 4200000, "Meghalaya": 3400000,
  "Manipur": 3300000, "Nagaland": 2300000, "Goa": 1600000,
  "Arunachal Pradesh": 1700000, "Mizoram": 1300000, "Sikkim": 700000,
  "Chandigarh": 1200000, "Ladakh": 300000,
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
