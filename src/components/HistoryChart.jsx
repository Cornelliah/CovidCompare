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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LINE_COLORS = [
  "rgb(37, 99, 235)",   // bleu
  "rgb(124, 58, 237)",  // violet
  "rgb(16, 185, 129)",  // vert
  "rgb(249, 115, 22)",  // orange
  "rgb(239, 68, 68)",   // rouge
  "rgb(14, 165, 233)",  // cyan
  "rgb(168, 85, 247)",  // purple
  "rgb(234, 179, 8)",   // jaune
];

const safeNumberOrNull = (v) =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

const HistoryChart = ({ countriesHistory = [] }) => {
  const valid = (countriesHistory || []).filter(Boolean);

  if (valid.length === 0) return null;

  // Union de toutes les dates
  const dateSet = new Set();
  valid.forEach((h) => {
    const casesObj = h?.timeline?.cases || {};
    Object.keys(casesObj).forEach((d) => dateSet.add(d));
  });

  const dates = Array.from(dateSet);

  // (Optionnel) Tri simple : comme l'API renvoie souvent "M/D/YY", un tri string peut être imparfait.
  // Si besoin, tu pourras remplacer par un tri via parsing Date.
  dates.sort((a, b) => a.localeCompare(b));

  const datasets = valid.map((h, idx) => {
    const casesObj = h?.timeline?.cases || {};
    return {
      label: h?.country ?? `Pays ${idx + 1}`,
      data: dates.map((d) => safeNumberOrNull(casesObj[d])),
      borderColor: LINE_COLORS[idx % LINE_COLORS.length],
      backgroundColor: "rgba(0,0,0,0)", // pas de fill
      tension: 0.3,
      pointRadius: 0, // + lisible si beaucoup de points
      spanGaps: true, // relie malgré les null si tu veux (true = courbe continue)
    };
  });

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Évolution des cas confirmés (30 derniers jours)",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${
              typeof ctx.parsed.y === "number"
                ? ctx.parsed.y.toLocaleString()
                : "N/A"
            }`,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      y: {
        ticks: {
          callback: (v) =>
            typeof v === "number" ? v.toLocaleString() : v,
        },
      },
    },
  };

  const data = { labels: dates, datasets };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <Line options={options} data={data} />
    </div>
  );
};

export default HistoryChart;
