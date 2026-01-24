import React from "react";
import Select from "react-select";
import "./CountrySelector.css";

const CountrySelector = ({ countries, selectedCountries, setSelectedCountries }) => {

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
            {[0, 1].map(index => (
                <div key={index} className="country-block">
                    <label className="country-label">
                        Pays {index + 1}
                    </label>

                    <Select
                        options={countries}
                        value={countries.find(c => c.value === selectedCountries[index])}
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

