import { SafeSite, Habitation, RelocationPlan } from '@/types';

/**
 * Relocation Engine — Prototype / Illustrative
 * Ranks safe sites for a given vulnerable habitation.
 * Replace this with a real optimization engine / ML model for production.
 */

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreForSite(site: SafeSite, habitation: Habitation, distance: number): number {
  const capacityScore = site.availableCapacity >= habitation.population ? 100 : (site.availableCapacity / habitation.population) * 100;
  const connectivityMap = { EXCELLENT: 100, GOOD: 75, FAIR: 50, POOR: 25 };
  const waterMap = { EXCELLENT: 100, GOOD: 75, FAIR: 50, POOR: 25 };
  const distanceScore = Math.max(0, 100 - distance * 2);

  return (
    site.safetyScore * 0.25 +
    capacityScore * 0.20 +
    distanceScore * 0.15 +
    connectivityMap[site.roadConnectivity] * 0.15 +
    waterMap[site.waterAvailability] * 0.10 +
    site.infrastructureScore * 0.10 +
    (site.availableCapacity > 0 ? 100 : 0) * 0.05
  );
}

export function rankSitesForHabitation(habitation: Habitation, sites: SafeSite[]): (SafeSite & { distance: number; matchScore: number })[] {
  return sites
    .filter(s => s.status !== 'FULL')
    .map(site => {
      const distance = haversineDistance(habitation.lat, habitation.lng, site.lat, site.lng);
      const matchScore = Math.round(scoreForSite(site, habitation, distance));
      return { ...site, distance: Math.round(distance * 10) / 10, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function generateRelocationPlan(habitation: Habitation, sites: SafeSite[]): RelocationPlan {
  const ranked = rankSitesForHabitation(habitation, sites);
  const selected: typeof ranked = [];
  let covered = 0;

  for (const site of ranked) {
    if (covered >= habitation.population) break;
    selected.push(site);
    covered += site.availableCapacity;
  }

  const totalCapacity = selected.reduce((s, x) => s + x.availableCapacity, 0);
  const capacityStatus =
    totalCapacity >= habitation.population ? 'SUFFICIENT' :
    totalCapacity >= habitation.population * 0.75 ? 'LIMITED' : 'INSUFFICIENT';

  const reasons = getSiteRecommendationReasons(habitation, selected[0]);

  return {
    habitationId: habitation.id,
    habitationName: habitation.name,
    population: habitation.population,
    riskScore: habitation.riskScore,
    priority: habitation.relocationPriority,
    sites: selected.map(s => ({
      siteId: s.id,
      siteName: s.name,
      capacity: s.availableCapacity,
      suitabilityScore: s.suitabilityScore,
      reasons: getSiteRecommendationReasons(habitation, s),
    })),
    totalCapacity,
    capacityStatus,
    recommendation: capacityStatus === 'SUFFICIENT'
      ? `Estimated relocation capacity is sufficient. Combined capacity (${totalCapacity.toLocaleString()}) exceeds required (${habitation.population.toLocaleString()}).`
      : capacityStatus === 'LIMITED'
      ? `Estimated capacity partially meets requirements. Additional sites may be needed.`
      : `Insufficient relocation capacity currently available. Urgent capacity development required.`,
    generatedAt: new Date().toISOString(),
    reasons,
  };
}

function getSiteRecommendationReasons(habitation: Habitation, site?: SafeSite & { distance?: number }): string[] {
  if (!site) return [];
  const reasons = [];
  if (site.safetyScore >= 85) reasons.push('High safety score — outside identified high-risk zones');
  if (site.roadConnectivity === 'EXCELLENT' || site.roadConnectivity === 'GOOD') reasons.push('Good road connectivity for evacuation and access');
  if (site.waterAvailability === 'GOOD' || site.waterAvailability === 'EXCELLENT') reasons.push('Adequate water availability for resettlement');
  if (site.healthcareDistance <= 10) reasons.push(`Healthcare facility within ${site.healthcareDistance} km`);
  if (site.electricityAccess) reasons.push('Electricity infrastructure available');
  if (site.availableCapacity >= habitation.population) reasons.push('Single-site capacity sufficient for entire habitation');
  if (site.distance && site.distance <= 30) reasons.push(`Proximity to origin (${site.distance} km) reduces displacement impact`);
  if (site.infrastructureScore >= 70) reasons.push('Strong existing infrastructure base');
  return reasons;
}
