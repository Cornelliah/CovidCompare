import { useState } from 'react'
import CountrySelector from "./components/CountrySelector";
import { countries } from "./data/countries";
import './App.css'

function App() {
    const [selectedCountries, setSelectedCountries] = useState([]);

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

export default App
