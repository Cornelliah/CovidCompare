// src/services/CovidAPI.js
// Service API pour disease.sh
// Base doc : https://disease.sh/docs

const BASE_URL = "https://disease.sh/v3/covid-19";

/**
 * Fetch JSON avec gestion d'erreur claire
 */
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${res.statusText} (${url}) ${text}`);
  }
  return res.json();
}

/**
 * Normalise le nom du pays pour les endpoints.
 * disease.sh accepte généralement: "france", "France", etc.
 */
function encodeParam(value) {
  return encodeURIComponent(String(value).trim());
}

/**
 * Liste des pays (pour remplir les dropdowns)
 * Retourne [{ label, value, iso2, flag }]
 */
export async function getCountriesList() {
  // all countries with basic stats
  const url = `${BASE_URL}/countries?allowNull=false`;
  const data = await fetchJson(url);

  // Tri alphabétique
  return data
    .map((c) => ({
      label: c.country,
      value: c.country, // on garde le "country" comme valeur
      iso2: c.countryInfo?.iso2 ?? null,
      flag: c.countryInfo?.flag ?? null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Snapshot stats pour 1 pays: cases, active, deaths, updated...
 */
export async function getCountrySnapshot(country) {
  const c = encodeParam(country);
  const url = `${BASE_URL}/countries/${c}?strict=true`;
  const data = await fetchJson(url);

  return {
    country: data.country,
    iso2: data.countryInfo?.iso2 ?? null,
    flag: data.countryInfo?.flag ?? null,
    cases: data.cases ?? 0,
    active: data.active ?? 0,
    deaths: data.deaths ?? 0,
    recovered: data.recovered ?? 0,
    todayCases: data.todayCases ?? 0,
    todayDeaths: data.todayDeaths ?? 0,
    updated: data.updated ?? null, // timestamp ms
  };
}

/**
 * Vaccination coverage pour 1 pays
 * lastdays=1 => dernier point (pratique pour une carte)
 * lastdays=30 => tendance
 *
 * Retour:
 * {
 *   country,
 *   timeline: { "1/15/26": 123, ... }  // selon format renvoyé
 * }
 */
export async function getVaccineCoverage(country, lastdays = 1) {
  const c = encodeParam(country);
  const url = `${BASE_URL}/vaccine/coverage/countries/${c}?lastdays=${lastdays}&fullData=false`;
  const data = await fetchJson(url);

  // data.timeline est un objet date->valeur
  return {
    country: data.country,
    timeline: data.timeline || {},
    updated: data.updated ?? null,
  };
}

/**
 * Tendances (historical) pour 1 pays sur X jours (ex 30)
 * Retour:
 * {
 *   country,
 *   timeline: {
 *     cases: {date: value},
 *     deaths: {date: value},
 *     recovered: {date: value}
 *   }
 * }
 */
export async function getCountryHistorical(country, lastdays = 30) {
  const c = encodeParam(country);
  const url = `${BASE_URL}/historical/${c}?lastdays=${lastdays}`;
  const data = await fetchJson(url);

  const timeline = data.timeline || {};
  return {
    country: data.country || country,
    timeline: {
      cases: timeline.cases || {},
      deaths: timeline.deaths || {},
      recovered: timeline.recovered || {},
    },
  };
}

/**
 * Liste continents (pour selector "par continent")
 * Retourne [{ label, value }]
 */
export async function getContinentsList() {
  const url = `${BASE_URL}/continents`;
  const data = await fetchJson(url);

  return data
    .map((c) => ({
      label: c.continent,
      value: c.continent,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Snapshot stats continent
 */
export async function getContinentSnapshot(continent) {
  const cont = encodeParam(continent);
  const url = `${BASE_URL}/continents/${cont}?strict=true`;
  const data = await fetchJson(url);

  return {
    continent: data.continent,
    cases: data.cases ?? 0,
    active: data.active ?? 0,
    deaths: data.deaths ?? 0,
    recovered: data.recovered ?? 0,
    todayCases: data.todayCases ?? 0,
    todayDeaths: data.todayDeaths ?? 0,
    updated: data.updated ?? null,
    countries: data.countries ?? [],
  };
}

/**
 * Helper: transforme un objet {date: value} en arrays Chart.js
 * - labels: ["01/12", "02/12", ...]
 * - data: [123, 456, ...]
 */
export function timelineToChartSeries(timelineObj) {
  const entries = Object.entries(timelineObj || {});
  return {
    labels: entries.map(([date]) => date),
    data: entries.map(([, value]) => Number(value) || 0),
  };
}

/**
 * Helper: convertit "cumul" -> "nouveaux par jour"
 * Exemple: timeline cases cumulé => daily new cases
 */
export function cumulativeToDaily(timelineObj) {
  const entries = Object.entries(timelineObj || {});
  const daily = {};
  let prev = null;

  for (const [date, valueRaw] of entries) {
    const value = Number(valueRaw) || 0;
    if (prev === null) {
      daily[date] = 0;
    } else {
      daily[date] = Math.max(0, value - prev);
    }
    prev = value;
  }

  return daily;
}

/**
 * Helper: formate le timestamp updated (ms) en date lisible FR
 */
export function formatUpdatedDate(updatedMs) {
  if (!updatedMs) return "—";
  const d = new Date(updatedMs);
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
