import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  // Obtener el total de valores en el conjunto de datos
  const total = chartData.datasets[0].data.reduce((acc, value) => acc + value, 0);

  // Calcular los porcentajes y almacenarlos en un array
  const percentages = chartData.datasets[0].data.map(value => ((value / total) * 100).toFixed(2));

  // Crear las etiquetas personalizadas en el formato deseado
  const labels = chartData.labels.map((label, index) => {
    return `${label}: ${percentages[index]}%`;
  });

  // Crear un nuevo conjunto de datos que contenga solo los valores
  const newData = {
    ...chartData,
    datasets: [
      {
        ...chartData.datasets[0],
        data: chartData.datasets[0].data,
      },
    ],
    labels: labels, // Utilizar las etiquetas personalizadas
  };

  return (
    <>
      <Pie
        data={newData} // Usar los datos modificados
        options={chartOptions}
      />
    </>
  );
}

export default PieChart;

