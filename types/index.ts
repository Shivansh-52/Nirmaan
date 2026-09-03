export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' | 'CRITICAL';
export type RelocationPriority = 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'MONITOR';
export type HazardLevel = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
export type ConnectivityLevel = 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
export type WaterAvailability = 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
export type AlertType = 'HIGH_RISK' | 'RED_ZONE' | 'CAPACITY' | 'RELOCATION' | 'SYSTEM';
export type CapacityStatus = 'SUFFICIENT' | 'LIMITED' | 'INSUFFICIENT';

export interface HazardProfile {
  flood: HazardLevel;
  landslide: HazardLevel;
  cloudburst: HazardLevel;
  coastalErosion: HazardLevel;
}

export interface RiskFactors {
  hazardIntensity: number;       // 0–100
  historicalFrequency: number;   // 0–100
  populationExposure: number;    // 0–100
  vulnerability: number;         // 0–100
  infrastructureRisk: number;    // 0–100
}

export interface Habitation {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  vulnerablePopulation: number;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryHazard: string;
  hazards: HazardProfile;
  historicalEvents: number;
  infrastructureScore: number;
  exposureScore: number;
  vulnerabilityScore: number;
  riskFactors: RiskFactors;
  relocationPriority: RelocationPriority;
  recommendedSites: string[];
  redZone: boolean;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'PLANNED';
  lastUpdated: string;
}

export interface SafeSite {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  safetyScore: number;
  suitabilityScore: number;
  totalCapacity: number;
  existingPopulation: number;
  availableCapacity: number;
  waterAvailability: WaterAvailability;
  healthcareDistance: number;   // km
  roadConnectivity: ConnectivityLevel;
  schoolDistance: number;       // km
  electricityAccess: boolean;
  infrastructureScore: number;
  distanceFromHabitation?: number; // km, computed
  status: 'AVAILABLE' | 'LIMITED' | 'FULL';
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  habitationId?: string;
  habitationName?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  read: boolean;
}

export interface RelocationPlan {
  habitationId: string;
  habitationName: string;
  population: number;
  riskScore: number;
  priority: RelocationPriority;
  sites: {
    siteId: string;
    siteName: string;
    capacity: number;
    suitabilityScore: number;
    reasons: string[];
  }[];
  totalCapacity: number;
  capacityStatus: CapacityStatus;
  recommendation: string;
  generatedAt: string;
  reasons: string[];
}

export interface RedZone {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  radius: number; // meters
  primaryHazard: string;
  riskScore: number;
  populationAffected: number;
  habitationCount: number;
  status: 'ACTIVE' | 'MONITORING' | 'DEACTIVATED';
  lastUpdated: string;
}

export interface DashboardStats {
  totalHabitations: number;
  redZones: number;
  highRiskHabitations: number;
  vulnerablePopulation: number;
  immediateRelocationCases: number;
  availableRelocationCapacity: number;
}
