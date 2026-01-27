import React from "react";
import Select from "react-select";
import "./CountrySelector.css";

const CountrySelector = ({
    countries,
    selectedCountries,
    setSelectedCountries,
    removeCountry
}) => {

    const handleChange = (index, selectedOption) => {
        const newSelected = [...selectedCountries];
        newSelected[index] = selectedOption?.value || null;
        setSelectedCountries(newSelected);
    };

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
        <div className="country-selector-container">
            {selectedCountries.map((_, index) => (
                <div key={index} className="country-block">
                    
                    <div className="country-header">
                        <label className="country-label">
                            Pays {index + 1}
                        </label>

                        {selectedCountries.length > 1 && (
                            <button
                                className="remove-btn"
                                onClick={() => removeCountry(index)}
                                title="Supprimer ce pays"
                            >
                                ❌
                            </button>
                        )}
                    </div>

                    <Select
                        options={countries}
                        value={countries.find(
                            c => c.value === selectedCountries[index]
                        )}
                        onChange={(option) => handleChange(index, option)}
                        components={{
                            Option: customOption,
                            SingleValue: customSingleValue
                        }}
                        placeholder="Choisir un pays"
                        isSearchable
                        classNamePrefix="react-select"
                    />
                </div>
            ))}
        </div>
    );
};

export default CountrySelector;
