import React from "react";
import "./CountryStats.css";

const CountryStats = ({ stats }) => {
    // Si pas de données, on affiche un placeholder
    if (!stats) {
        return (
            <div className="empty-card">
                <p>Sélectionnez un pays</p>
            </div>
        );
    }

    // Fonction pour formater les nombres (ex: 1,200,000)
    const formatNumber = (num) => {
        return new Intl.NumberFormat('fr-FR').format(num);
    };

    return (
        <div className="country-card">
            <div className="card-header">
                <img src={stats.flag} alt={`Drapeau ${stats.country}`} />
                <h2>{stats.country}</h2>
            </div>

            <div className="stats-grid">
                {/* Cas Totaux */}
                <div className="stat-item">
                    <h4>Cas Totaux</h4>
                    <p className="text-blue">{formatNumber(stats.cases)}</p>
                    {stats.todayCases > 0 && (
                        <div className="new-cases text-blue">
                            +{formatNumber(stats.todayCases)} auj.
                        </div>
                    )}
                </div>

                {/* Décès */}
                <div className="stat-item">
                    <h4>Décès</h4>
                    <p className="text-red">{formatNumber(stats.deaths)}</p>
                    {stats.todayDeaths > 0 && (
                        <div className="new-cases text-red">
                            +{formatNumber(stats.todayDeaths)} auj.
                        </div>
                    )}
                </div>

                {/* Guéris */}
                <div className="stat-item">
                    <h4>Guéris</h4>
                    <p className="text-green">{formatNumber(stats.recovered)}</p>
                </div>

                {/* Actifs */}
                <div className="stat-item">
                    <h4>Cas Actifs</h4>
                    <p className="text-orange">{formatNumber(stats.active)}</p>
                </div>
            </div>
        </div>
    );
};

export default CountryStats;