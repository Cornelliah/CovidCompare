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

// Palette simple (tu peux en ajouter)
const COLORS = [
  "rgba(59, 130, 246, 0.7)",   // bleu
  "rgba(124, 58, 237, 0.7)",   // violet
  "rgba(16, 185, 129, 0.7)",   // vert
  "rgba(249, 115, 22, 0.7)",   // orange
  "rgba(239, 68, 68, 0.7)",    // rouge
  "rgba(14, 165, 233, 0.7)",   // cyan
  "rgba(168, 85, 247, 0.7)",   // purple
  "rgba(234, 179, 8, 0.7)",    // jaune
];

const safeNumber = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

const ComparisonChart = ({ countriesData = [] }) => {
  const validCountries = (countriesData || []).filter(Boolean);

  if (validCountries.length === 0) {
    return (
      <p style={{ textAlign: "center" }}>
        Sélectionnez des pays pour voir le comparatif.
      </p>
    );
  }

  const labels = ["Cas Totaux", "Cas Actifs", "Décès", "Guérisons"];

  const chartData = {
    labels,
    datasets: validCountries.map((c, idx) => ({
      label: c?.country ?? `Pays ${idx + 1}`,
      data: [
        safeNumber(c?.cases),
        safeNumber(c?.active),
        safeNumber(c?.deaths),
        safeNumber(c?.recovered),
      ],
      backgroundColor: COLORS[idx % COLORS.length],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Comparaison Directe" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString?.() ?? ctx.parsed.y}`,
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ComparisonChart;
