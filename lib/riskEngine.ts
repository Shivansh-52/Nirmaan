import { Habitation, HazardLevel } from '@/types';

const hazardLevelScore: Record<HazardLevel, number> = {
  NONE: 0,
  LOW: 25,
  MODERATE: 50,
  HIGH: 75,
  VERY_HIGH: 100,
};

/**
 * Prototype / Illustrative Risk Methodology
 * This is a transparent, deterministic scoring model for demonstration purposes.
 * It does NOT represent an official government risk formula.
 * Designed so a real ML model / API can replace this function later.
 *
 * Weights:
 *  - Hazard Intensity:        30%
 *  - Historical Frequency:    20%
 *  - Population Exposure:     20%
 *  - Vulnerability:           20%
 *  - Infrastructure Risk:     10%
 */
export function calculateRiskScore(h: Habitation): number {
  const w = { hazard: 0.30, history: 0.20, exposure: 0.20, vulnerability: 0.20, infra: 0.10 };

  const hazardMax = Math.max(
    hazardLevelScore[h.hazards.flood],
    hazardLevelScore[h.hazards.landslide],
    hazardLevelScore[h.hazards.cloudburst],
    hazardLevelScore[h.hazards.coastalErosion]
  );
  const hazardAvg = (
    hazardLevelScore[h.hazards.flood] +
    hazardLevelScore[h.hazards.landslide] +
    hazardLevelScore[h.hazards.cloudburst] +
    hazardLevelScore[h.hazards.coastalErosion]
  ) / 4;

  const hazardIntensity = (hazardMax * 0.7 + hazardAvg * 0.3);
  const historyScore = Math.min((h.historicalEvents / 10) * 100, 100);
  const exposureScore = h.exposureScore;
  const vulnerabilityScore = h.vulnerabilityScore;
  const infraRisk = 100 - h.infrastructureScore;

  const score =
    hazardIntensity * w.hazard +
    historyScore * w.history +
    exposureScore * w.exposure +
    vulnerabilityScore * w.vulnerability +
    infraRisk * w.infra;

  return Math.round(Math.min(Math.max(score, 0), 100));
}

export function getRiskLevel(score: number): Habitation['riskLevel'] {
  if (score <= 20) return 'LOW';
  if (score <= 40) return 'MODERATE';
  if (score <= 60) return 'HIGH';
  if (score <= 80) return 'VERY_HIGH';
  return 'CRITICAL';
}

export function getRelocationPriority(score: number, historicalEvents: number): Habitation['relocationPriority'] {
  if (score >= 80 || (score >= 70 && historicalEvents >= 4)) return 'IMMEDIATE';
  if (score >= 60) return 'SHORT_TERM';
  if (score >= 40) return 'MEDIUM_TERM';
  return 'MONITOR';
}

export function getRiskColor(level: Habitation['riskLevel'] | string): string {
  switch (level) {
    case 'LOW': return '#22c55e';
    case 'MODERATE': return '#eab308';
    case 'HIGH': return '#f97316';
    case 'VERY_HIGH': return '#ef4444';
    case 'CRITICAL': return '#dc2626';
    default: return '#6b7280';
  }
}

export function getPriorityColor(priority: Habitation['relocationPriority'] | string): string {
  switch (priority) {
    case 'IMMEDIATE': return '#dc2626';
    case 'SHORT_TERM': return '#f97316';
    case 'MEDIUM_TERM': return '#eab308';
    case 'MONITOR': return '#22c55e';
    default: return '#6b7280';
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'IMMEDIATE': return 'Immediate';
    case 'SHORT_TERM': return 'Short-Term';
    case 'MEDIUM_TERM': return 'Medium-Term';
    case 'MONITOR': return 'Monitor';
    default: return priority;
  }
}

export function getRiskExplanation(h: Habitation): string[] {
  const reasons: string[] = [];
  if (h.hazards.landslide === 'VERY_HIGH' || h.hazards.landslide === 'HIGH')
    reasons.push(`Very high landslide exposure (${h.hazards.landslide})`);
  if (h.hazards.flood === 'VERY_HIGH' || h.hazards.flood === 'HIGH')
    reasons.push(`High flood risk (${h.hazards.flood})`);
  if (h.historicalEvents >= 4)
    reasons.push(`${h.historicalEvents} recorded disaster events in history`);
  if (h.vulnerabilityScore >= 70)
    reasons.push(`High population vulnerability index (${h.vulnerabilityScore}/100)`);
  if (h.infrastructureScore <= 40)
    reasons.push(`Critical infrastructure deficiency (score: ${h.infrastructureScore}/100)`);
  if (h.vulnerablePopulation / h.population >= 0.5)
    reasons.push(`${Math.round((h.vulnerablePopulation / h.population) * 100)}% of population is vulnerable`);
  if (h.hazards.cloudburst === 'HIGH' || h.hazards.cloudburst === 'VERY_HIGH')
    reasons.push(`Significant cloudburst risk (${h.hazards.cloudburst})`);
  if (h.hazards.coastalErosion === 'HIGH' || h.hazards.coastalErosion === 'VERY_HIGH')
    reasons.push(`Coastal erosion threat (${h.hazards.coastalErosion})`);
  return reasons;
}
