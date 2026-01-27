import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Enregistrement des composants Chart.js obligatoires
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const ComparisonChart = ({ data1, data2 }) => {
    // Si aucune donnée n'est prête, on n'affiche rien ou un placeholder
    if (!data1 && !data2) {
        return (
            <p style={{ textAlign: "center" }}>
                Sélectionnez des pays pour voir le comparatif.
            </p>
        );
    }

    // Préparation des données pour Chart.js
    const chartData = {
        labels: ["Cas Totaux", "Cas Actifs", "Décès", "Guérisons"],
        datasets: [
            {
                label: data1 ? data1.country : "Pays 1",
                data: data1
                    ? [data1.cases, data1.active, data1.deaths, data1.recovered]
                    : [],
                backgroundColor: "rgba(59, 130, 246, 0.7)", // Bleu
            },
            {
                label: data2 ? data2.country : "Pays 2",
                data: data2
                    ? [data2.cases, data2.active, data2.deaths, data2.recovered]
                    : [],
                backgroundColor: "rgba(124, 58, 237, 0.7)", // Violet
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Comparaison Directe" },
        },
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default ComparisonChart;
