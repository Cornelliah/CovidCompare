import React, { useEffect, useState } from "react";
import CountrySelector from "./components/CountrySelector";
import ComparisonChart from "./components/ComparisonChart";
import CountryStats from "./components/CountryStats";
import HistoryChart from "./components/HistoryChart";
import { getCountriesList, getCountrySnapshot, getCountryHistorical, formatUpdatedDate } from "./services/CovidAPI";
import "./App.css";

function App() {
    const [countries, setCountries] = useState([]);

    // On commence avec 1 seul pays vide au lieu de 2
    const [selectedCountries, setSelectedCountries] = useState([null]);
    const [stats, setStats] = useState([null]);
    const [history, setHistory] = useState([null]);

    const [loading, setLoading] = useState(true);

    // Chargement initial liste pays
    useEffect(() => {
        async function loadCountries() {
            const data = await getCountriesList();
            setCountries(data);
            setLoading(false);
        }
        loadCountries();
    }, []);

    // --- GESTION DES LISTES ---

    const addCountry = () => {
        if (selectedCountries.length < 5) { // Limite à 5 pays max
            setSelectedCountries([...selectedCountries, null]);
            // On agrandit aussi les tableaux de résultats pour éviter les décalages
            setStats([...stats, null]);
            setHistory([...history, null]);
        }
    };

    const removeCountry = (index) => {
        const newSelected = selectedCountries.filter((_, i) => i !== index);
        const newStats = stats.filter((_, i) => i !== index);
        const newHistory = history.filter((_, i) => i !== index);

        setSelectedCountries(newSelected);
        setStats(newStats);
        setHistory(newHistory);
    };

    const handleCountryChange = (index, selectedOption) => {
        const newSelected = [...selectedCountries];
        newSelected[index] = selectedOption?.value || null;
        setSelectedCountries(newSelected);
    };

    // --- LOGIQUE API ---
    // Se déclenche quand selectedCountries change
    useEffect(() => {
        async function fetchAllStats() {
            // On prépare les promesses pour tous les pays sélectionnés
            const promises = selectedCountries.map(async (country) => {
                if (!country) return { stat: null, hist: null };
                try {
                    const [stat, hist] = await Promise.all([
                        getCountrySnapshot(country),
                        getCountryHistorical(country, 30)
                    ]);
                    return { stat, hist };
                } catch (error) {
                    console.error("Erreur fetch", country);
                    return { stat: null, hist: null };
                }
            });

            const results = await Promise.all(promises);

            // On sépare les résultats dans les deux states
            setStats(results.map(r => r.stat));
            setHistory(results.map(r => r.hist));
        }

        fetchAllStats();
    }, [selectedCountries]);

    // Récupérer la date la plus récente parmi tous les stats
    const lastUpdate = stats.reduce((latest, current) => {
        if (!current?.updated) return latest;
        return Math.max(latest, current.updated);
    }, 0);


    if (loading) return <p>Chargement...</p>;

    return (
        <div className="app-container">
            <div className="header-card">
                <h1>Comparateur COVID-19</h1>
                <p>Comparez les statistiques entre plusieurs pays</p>
                {lastUpdate > 0 && (
                    <p style={{ fontSize: '0.9em', marginTop: '10px', opacity: 0.8 }}>
                        Maj : {formatUpdatedDate(lastUpdate)}
                    </p>
                )}
            </div>

            {/* Sélecteur mis à jour avec les nouvelles props */}
            <CountrySelector
                countries={countries}
                selectedCountries={selectedCountries}
                handleChange={handleCountryChange} // Nouvelle prop
                addCountry={addCountry}           // Nouvelle prop
                removeCountry={removeCountry}     // Nouvelle prop
            />

            {/* Zone des cartes (Mapping dynamique) */}
            <div className="stats-section" style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: 'center' }}>
                    {stats.map((stat, index) => (
                        <CountryStats key={index} stats={stat} />
                    ))}
                </div>
            </div>

            {/* Graphiques mis à jour pour recevoir des tableaux */}
            <div style={{ marginTop: "40px" }}>
                <ComparisonChart data={stats} />
                <HistoryChart historyList={history} />
            </div>
        </div>
    );
}

export default App;