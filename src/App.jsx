import React, { useEffect, useState } from "react";
import CountrySelector from "./components/CountrySelector";
import { getCountriesList } from "./services/CovidAPI";

function App() {
    const [countries, setCountries] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Chargement des pays...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Comparateur COVID-19</h1>

            <CountrySelector
                countries={countries}
                selectedCountries={selectedCountries}
                setSelectedCountries={setSelectedCountries}
            />
        </div>
    );
}

export default App;
