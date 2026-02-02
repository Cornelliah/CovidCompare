import React from "react";
import Select from "react-select";
import "./CountrySelector.css";

const CountrySelector = ({ countries, selectedCountries, handleChange, addCountry, removeCountry }) => {

    const customOption = ({ innerProps, data }) => (
        <div {...innerProps} className="option">
            <img src={data.flag} alt={data.label} />
            <span>{data.label}</span>
        </div>
    );

    const customSingleValue = ({ data }) => (
        <div className="single-value">
            <img src={data.flag} alt={data.label} />
            <span>{data.label}</span>
        </div>
    );

    return (
        <div className="selector-wrapper">
            <div className="country-selector-container">
                {selectedCountries.map((countryCode, index) => (
                    <div key={index} className="country-block">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <label className="country-label">Pays {index + 1}</label>
                            {/* Bouton supprimer (sauf s'il n'y en a qu'un seul) */}
                            {selectedCountries.length > 1 && (
                                <button
                                    onClick={() => removeCountry(index)}
                                    style={{ padding: '2px 8px', fontSize: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <Select
                            options={countries}
                            value={countries.find(c => c.value === countryCode)}
                            onChange={(option) => handleChange(index, option)}
                            components={{ Option: customOption, SingleValue: customSingleValue }}
                            placeholder="Choisir..."
                            classNamePrefix="react-select"
                        />
                    </div>
                ))}
            </div>

            {/* Bouton Ajouter */}
            {selectedCountries.length < 5 && (
                <button
                    onClick={addCountry}
                    style={{ marginTop: '20px', background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Ajouter un pays
                </button>
            )}
        </div>
    );
};

export default CountrySelector;