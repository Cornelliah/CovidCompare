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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = [
    'rgba(59, 130, 246, 0.8)', 'rgba(124, 58, 237, 0.8)',
    'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)'
];

const ComparisonChart = ({ data }) => {
    // data est maintenant un tableau : [statsPays1, statsPays2, statsPays3...]

    // On filtre pour ne garder que les pays qui ont des données chargées
    const validData = data.filter(item => item !== null);

    if (validData.length === 0) {
        return <p style={{ textAlign: "center" }}>Sélectionnez des pays pour voir le comparatif.</p>;
    }

    const chartData = {
        labels: ["Cas Totaux", "Cas Actifs", "Décès", "Guérisons"],
        datasets: validData.map((countryStats, index) => ({
            label: countryStats.country,
            data: [
                countryStats.cases,
                countryStats.active,
                countryStats.deaths,
                countryStats.recovered
            ],
            backgroundColor: COLORS[index % COLORS.length], // On cycle sur les couleurs
        })),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Comparaison Multi-pays" },
        },
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default ComparisonChart;