import React from "react";
import { Pie } from "react-chartjs-2";

const NivelChart = ({ chartData }) => {

  return (
    <div>
      <Pie
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.datasets[0].data, // Accede a los datos dentro del primer objeto del array
              backgroundColor: chartData.datasets[0].backgroundColor, // Accede a los colores de fondo dentro del primer objeto del array
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
            datalabels: {
              formatter: (value, context) => {
                const dataset = context.chart.data.datasets[0];
                const total = dataset.data.reduce((acc, data) => acc + data, 0);
                const percentage = ((value / total) * 100).toFixed(2) + "%";
                return `${percentage} (${value})`; // Agrega la cantidad al porcentaje
              },
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
};

export default NivelChart;
