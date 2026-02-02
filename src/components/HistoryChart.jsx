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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORS = [
    'rgba(59, 130, 246, 1)', 'rgba(124, 58, 237, 1)',
    'rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)'
];

const HistoryChart = ({ historyList }) => {
    // historyList est un tableau [hist1, hist2...]
    const validHistory = historyList.filter(h => h !== null);

    if (validHistory.length === 0) return null;

    // On prend les dates du premier pays valide pour l'axe X
    const rawDataFirst = validHistory[0]?.timeline?.cases || {};
    const dates = Object.keys(rawDataFirst);

    const datasets = validHistory.map((h, index) => ({
        label: h.country,
        data: Object.values(h.timeline.cases || {}),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        tension: 0.3,
    }));

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Évolution des cas (30 jours)" },
        },
        interaction: { mode: 'index', intersect: false },
    };

    const data = { labels: dates, datasets: datasets };

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", background: "white", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default HistoryChart;