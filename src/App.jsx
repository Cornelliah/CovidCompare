import React, { useEffect, useState } from "react";
import CountrySelector from "./components/CountrySelector";
import ComparisonChart from "./components/ComparisonChart";
import CountryStats from "./components/CountryStats";
import HistoryChart from "./components/HistoryChart"; // <--- NOUVEAU IMPORT
import {
    getCountriesList,
    getCountrySnapshot,
    getCountryHistorical, // <--- NOUVEAU IMPORT
    formatUpdatedDate
} from "./services/CovidAPI";
import "./App.css";

function App() {
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([null]);

    // Stats instantanées (Cartes + Bar chart)
    const [stats, setStats] = useState([null]);

    // Historique sur 30 jours (Line chart)
    const [history, setHistory] = useState([null]); // <--- NOUVEL ÉTAT

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const MAX_COUNTRIES = 6;

    const addCountry = () => {
        if (selectedCountries.length >= MAX_COUNTRIES) return;

        setSelectedCountries(prev => [...prev, null]);
        setStats(prev => [...prev, null]);
        setHistory(prev => [...prev, null]);
    };

   
    const removeCountry = (indexToRemove) => {
        setSelectedCountries(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        setStats(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        setHistory(prev =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    // Chargement liste pays
    useEffect(() => {
        async function loadCountries() {
            try {
                const data = await getCountriesList();
                setCountries(data);
            } catch (err) {
                setError("Erreur lors du chargement des pays");
            } finally {
                setLoading(false);
            }
        }
        loadCountries();
    }, []);

    // Chargement des données (Snapshot + Historique) au changement de sélection
   useEffect(() => {
    async function fetchStats() {
        const newStats = [...stats];
        const newHistory = [...history];

        await Promise.all(
            selectedCountries.map((country, index) =>
                (async () => {
                    if (country) {
                        try {
                            const [snapshotData, historyData] = await Promise.all([
                                getCountrySnapshot(country),
                                getCountryHistorical(country, 30),
                            ]);
                            newStats[index] = snapshotData;
                            newHistory[index] = historyData;
                        } catch (e) {
                            console.error("Erreur fetch pays", e);
                        }
                    } else {
                        newStats[index] = null;
                        newHistory[index] = null;
                    }
                })()
            )
        );

        setStats(newStats);
        setHistory(newHistory);
    }

    fetchStats();
}, [selectedCountries]);

    const getLastUpdateDate = () => {
  const updates = stats
    .map((s) => s?.updated)
    .filter((u) => typeof u === "number" && Number.isFinite(u));

  if (updates.length === 0) return null;
  return Math.max(...updates);
};


    const lastUpdate = getLastUpdateDate();

    if (loading) return <p>Chargement des pays...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="app-container">
            <div className="header-card">
                <h1>Comparateur COVID-19</h1>
                <p>Comparez les statistiques COVID-19 entre pays en temps réel</p>
                {lastUpdate && (
                    <p style={{ fontSize: '0.9em', marginTop: '10px', opacity: 0.8 }}>
                        Dernière mise à jour : {formatUpdatedDate(lastUpdate)}
                    </p>
                )}
            </div>

            <CountrySelector
                countries={countries}
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
                removeCountry={removeCountry}
                canAddMore={selectedCountries.length < MAX_COUNTRIES}
            />

            <button className="add-country-btn" onClick={addCountry}  disabled={selectedCountries.length >= MAX_COUNTRIES}>
             + Ajouter un pays
             
            </button>

             {selectedCountries.length >= MAX_COUNTRIES && (
                    <p style={{ fontSize: "0.85em", opacity: 0.7 }}>
                        Limité à {MAX_COUNTRIES} pays maximum
                    </p>
              )}



            <div className="stats-section" style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                     {stats.map((stat, index) => (
                         <CountryStats key={index} stats={stat} />
                      ))}
                </div>

            </div>

            {/* Zone des graphiques */}
<div style={{ marginTop: "40px" }}>
  {/* Graphique 1 : Comparaison globale (Barres) */}
  <ComparisonChart countriesData={stats.filter(Boolean)} />

  {/* Graphique 2 : Historique (Lignes) */}
  <HistoryChart countriesHistory={history.filter(Boolean)} />
</div>

        </div>
    );
}

export default App;