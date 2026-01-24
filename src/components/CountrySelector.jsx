import React from "react";

const CountrySelector = ({ countries, selectedCountries, setSelectedCountries }) => {

    const handleSelect = (e) => {
        const value = e.target.value;

        if (
            value &&
            !selectedCountries.includes(value) &&
            selectedCountries.length < 2
        ) {
            setSelectedCountries([...selectedCountries, value]);
        }
    };

    const removeCountry = (value) => {
        setSelectedCountries(selectedCountries.filter(c => c !== value));
    };

    // Filtrer les pays déjà sélectionnés
    const availableCountries = countries.filter(
        c => !selectedCountries.includes(c.value)
    );

    return (
        <div>
            <h3>Sélectionner 2 pays</h3>

            <select onChange={handleSelect} value="">
                <option value="">-- Choisir un pays --</option>
                {availableCountries.map(country => (
                    <option key={country.value} value={country.value}>
                        {country.label}
                    </option>
                ))}
            </select>

            <div style={{ marginTop: "10px" }}>
                <h4>Pays sélectionnés :</h4>

                {selectedCountries.map(value => {
                    const country = countries.find(c => c.value === value);
                    return (
                        <div key={value}>
                            {country?.flag && (
                                <img
                                    src={country.flag}
                                    alt={country.label}
                                    width="20"
                                    style={{ marginRight: "8px" }}
                                />
                            )}
                            {country?.label}
                            <button onClick={() => removeCountry(value)}> ❌</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CountrySelector;
