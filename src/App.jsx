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
    const [selectedCountries, setSelectedCountries] = useState([null, null]);

    // Stats instantanées (Cartes + Bar chart)
    const [stats, setStats] = useState([null, null]);

    // Historique sur 30 jours (Line chart)
    const [history, setHistory] = useState([null, null]); // <--- NOUVEL ÉTAT

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            const newHistory = [...history]; // <--- COPIE

            // Fonction helper pour charger un pays
            const loadCountryData = async (countryName, index) => {
                if (countryName) {
                    try {
                        // 1. On lance les deux requêtes en parallèle pour gagner du temps
                        const [snapshotData, historyData] = await Promise.all([
                            getCountrySnapshot(countryName),
                            getCountryHistorical(countryName, 30) // 30 jours d'historique
                        ]);

                        newStats[index] = snapshotData;
                        newHistory[index] = historyData; // <--- STOCKAGE
                    } catch (e) {
                        console.error("Erreur fetch pays", e);
                    }
                } else {
                    newStats[index] = null;
                    newHistory[index] = null;
                }
            };

            // Chargement Pays 1
            await loadCountryData(selectedCountries[0], 0);

            // Chargement Pays 2
            await loadCountryData(selectedCountries[1], 1);

            setStats(newStats);
            setHistory(newHistory); // <--- MISE À JOUR STATE
        }

        fetchStats();
    }, [selectedCountries]);

    const getLastUpdateDate = () => {
        const d1 = stats[0]?.updated;
        const d2 = stats[1]?.updated;
        if (!d1 && !d2) return null;
        return Math.max(d1 || 0, d2 || 0);
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
            />

            <div className="stats-section" style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <CountryStats stats={stats[0]} />
                    <CountryStats stats={stats[1]} />
                </div>
            </div>

            {/* Zone des graphiques */}
            <div style={{ marginTop: "40px" }}>
                {/* Graphique 1 : Comparaison globale (Barres) */}
                <ComparisonChart data1={stats[0]} data2={stats[1]} />

                {/* Graphique 2 : Historique (Lignes) - NOUVEAU */}
                <HistoryChart history1={history[0]} history2={history[1]} />
            </div>
        </div>
    );
}

export default App;