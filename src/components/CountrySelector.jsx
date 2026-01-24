import React from "react";

const CountrySelector = ({ countries, selectedCountries, setSelectedCountries }) => {

    const handleSelect = (event) => {
        const countryCode = event.target.value;

        if (
            countryCode &&
            !selectedCountries.includes(countryCode) &&
            selectedCountries.length < 2
        ) {
            setSelectedCountries([...selectedCountries, countryCode]);
        }
    };

    const removeCountry = (code) => {
        setSelectedCountries(selectedCountries.filter(c => c !== code));
    };

    // Filtrer la liste pour ne pas afficher les pays déjà sélectionnés
    const availableCountries = countries.filter(
        c => !selectedCountries.includes(c.code)
    );

    return (
        <div>
            <h3>Sélectionner 2 pays</h3>

            <select onChange={handleSelect} value="">
                <option value="">-- Choisir un pays --</option>
                {availableCountries.map(country => (
                    <option key={country.code} value={country.code}>
                        {country.name}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: "10px" }}>
                <h4>Pays sélectionnés :</h4>
                {selectedCountries.map(code => {
                    const country = countries.find(c => c.code === code);
                    return (
                        <div key={code}>
                            {country?.name}
                            <button onClick={() => removeCountry(code)}>❌</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CountrySelector;