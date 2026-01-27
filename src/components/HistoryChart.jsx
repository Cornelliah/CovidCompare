import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// On enregistre les éléments nécessaires pour les lignes
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HistoryChart = ({ history1, history2 }) => {
    if (!history1 && !history2) return null;

    // On récupère les dates depuis le premier pays disponible pour l'axe X
    // L'API renvoie un objet { "date": valeur }, on prend les clés
    const rawData1 = history1?.timeline?.cases || {};
    const dates = Object.keys(rawData1);

    // Préparation des datasets
    const datasets = [];

    if (history1) {
        datasets.push({
            label: history1.country,
            data: Object.values(history1.timeline.cases),
            borderColor: "rgb(37, 99, 235)", // Bleu
            backgroundColor: "rgba(37, 99, 235, 0.5)",
            tension: 0.3, // Pour courber légèrement la ligne
        });
    }

    if (history2) {
        datasets.push({
            label: history2.country,
            data: Object.values(history2.timeline.cases || {}),
            borderColor: "rgb(124, 58, 237)", // Violet
            backgroundColor: "rgba(124, 58, 237, 0.5)",
            tension: 0.3,
        });
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Évolution des cas confirmés (30 derniers jours)",
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const data = {
        labels: dates, // Les dates en bas (ex: 10/22/24)
        datasets: datasets,
    };

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", background: "white", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default HistoryChart;