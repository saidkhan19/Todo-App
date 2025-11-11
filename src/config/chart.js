import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        font: {
          size: 11,
        },
      },
      border: {
        color: "#e5e7eb",
        width: 2,
      },
    },
    y: {
      stacked: true,
      ticks: {
        precision: 0,
        color: "#6b7280",
        font: {
          size: 11,
        },
        padding: 8,
      },
      grid: {
        color: "#e5e7eb",
        tickLength: 0,
      },
      border: {
        dash: [4, 4],
        color: "#e5e7eb",
        width: 2,
      },
    },
  },
};

export const productivityChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7280",
        font: {
          size: 11,
        },
      },
      border: {
        color: "#e5e7eb",
        width: 2,
      },
    },
    y: {
      beginAtZero: true,
      max: 100,
      stacked: true,
      ticks: {
        precision: 0,
        callback: (value) => value + "%",
        color: "#6b7280",
        font: {
          size: 11,
        },
        padding: 8,
      },
      grid: {
        color: "#e5e7eb",
        tickLength: 0,
      },
      border: {
        dash: [4, 4],
        color: "#e5e7eb",
        width: 2,
      },
    },
  },
};
