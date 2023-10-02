import React from "react";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Global/Header";
import { mockTransactions } from "../../data/mockData";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import DownloadIcon from "@mui/icons-material/Download";
import GroupsIcon from "@mui/icons-material/Groups";
import StatBox from "../../components/admin/Card/StateBox";
import BarChart from "../../components/admin/Dashboard/IncidenciasChart";
import PieChart from "../../components/admin/Dashboard/IncidenciasLine";
import NivelChart from "../../components/admin/Dashboard/NivelIncidenciaLine";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { UserData } from "../../data/data";

// Autenticacion
import useAuth from "../../hooks/useAuth";

// Importamos Api de Ticket
import { Ticket } from "../../api/ticket";

const ticketController = new Ticket();

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Efectividad %",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const [chartNivel, setChartNivel] = useState({
    labels: [],
    datasets: [
      {
        label: "Nivel",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  const [nivel1Data, setNivel1Data] = useState({
    labels: ["Dentro de 12hs", "Fuera de 12hs"],
    datasets: [
      {
        label: "Nivel 1",
        data: [],
        backgroundColor: ["#FF5733", "#FFC300"], // Colores para cada nivel
      },
    ],
  });

  const [nivel2Data, setNivel2Data] = useState({
    labels: ["Dentro de 24hs", "+ de 12hs y - de 24hs"],
    datasets: [
      {
        label: "Nivel 2",
        data: [],
        backgroundColor: ["#FF5733", "#FFC300"], // Colores para cada nivel
      },
    ],
  });

  const [nivel3Data, setNivel3Data] = useState({
    labels: ["Dentro de 48hs", "+ de 24hs y - de 48 hs"],
    datasets: [
      {
        label: "Nivel 3",
        data: [],
        backgroundColor: ["#FF5733", "#FFC300"], // Colores para cada nivel
      },
    ],
  });

  const [PieData, setPietData] = useState({
    labels: [],
    datasets: [
      {
        label: "Efectividad %",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  // Graficos de Niveles

  useEffect(() => {
    // Copiamos tu array UserData para trabajar con él.
    const data = [...UserData];

    // A continuación, inicializa los contadores para cada nivel
    let nivel1CountInside = 0;
    let nivel2CountInside = 0;
    let nivel3CountInside = 0;

    let nivel1CountOutside = 0;
    let nivel2CountOutside = 0;
    let nivel3CountOutside = 0;

    // Filtra las incidencias que tienen estado "close"
    const closeIncidencias = data.filter(
      (incidencia) => incidencia.status === "closed"
    );

    // Itera a través de cada incidencia y cuenta en qué nivel se encuentra
    closeIncidencias.forEach((incidencia) => {
      const createdDate = new Date(incidencia.created_at);
      const closedDate = new Date(incidencia.closedAt);
      const diffHours = (closedDate - createdDate) / (1000 * 60 * 60); // Diferencia en horas

      if (diffHours <= 12) {
        nivel1CountInside += 1;
      } else {
        nivel1CountOutside += 1;
      }

      if (diffHours > 12 && diffHours <= 24) {
        nivel2CountInside += 1;
      } else {
        nivel2CountOutside += 1;
      }

      if (diffHours > 24 && diffHours <= 48) {
        nivel3CountInside += 1;
      } else {
        nivel3CountOutside += 1;
      }
    });

    // Actualiza los estados con los datos calculados para cada nivel
    setNivel1Data((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [nivel1CountInside, nivel1CountOutside], // Actualiza los datos
        },
      ],
    }));

    setNivel2Data((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [nivel2CountInside, nivel2CountOutside], // Actualiza los datos
        },
      ],
    }));

    setNivel3Data((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: [nivel3CountInside, nivel3CountOutside], // Actualiza los datos
        },
      ],
    }));
  }, [UserData]);

  useEffect(() => {
    // Copiamos tu array UserData para trabajar con él.
    const data = [...UserData];

    // Array con los nombres de los meses
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    // PieChart
    if (data) {
      const total = data.length;
      const closedCount = data.filter(
        (incident) => incident.status === "closed"
      ).length;
      const openCount = total - closedCount;

      const chartData = {
        labels: ["Abiertas", "Cerradas"],
        datasets: [
          {
            data: [openCount, closedCount],
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(75, 192, 192, 0.6)",
            ],
          },
        ],
      };

      setPietData(chartData);
    }

    // A continuación, calcula la efectividad por mes
    const monthlyData = data.reduce((acc, incident) => {
      const date = new Date(incident.created_at);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (!acc[`${year}-${month + 1}`]) {
        acc[`${year}-${month + 1}`] = {
          total: 0,
          closed: 0,
        };
      }

      acc[`${year}-${month + 1}`].total += 1;
      if (incident.status === "closed") {
        acc[`${year}-${month + 1}`].closed += 1;
      }

      return acc;
    }, {});

    // Calcula el porcentaje de efectividad por mes
    const labels = [];
    const percentages = [];

    for (const key in monthlyData) {
      if (monthlyData.hasOwnProperty(key)) {
        const { total, closed } = monthlyData[key];
        const [year, month] = key.split("-"); // Separar el año y el mes
        const monthLabel = `${monthNames[parseInt(month, 10) - 1]} ${year}`; // Obtener el nombre del mes correspondiente
        const effectivenessPercentage = (closed / total) * 100 || 0; // Evitar división por cero

        labels.push(monthLabel);
        percentages.push(effectivenessPercentage.toFixed(2)); // Redondear a 2 decimales
      }
    }

    setChartData({
      labels,
      datasets: [
        {
          label: "Efectividad %",
          data: percentages,
          backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de las barras
        },
      ],
    });
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useAuth();

  // Estado
  const [count, setCount] = useState("");
  const [countClose, setCountClose] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await ticketController.getTicketCount(token);
        setCount(response.tickets);

        const response2 = await ticketController.getTicketCountClose(token);
        setCountClose(response2.tickets);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashbaord" />
        </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            backgroundColor="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
          >
            <div>
              <h3>Incidencias</h3>
            </div>
            <div style={{ width: 120 }}>
              <PieChart chartData={PieData} />
            </div>
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 3"
            backgroundColor="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
          >
            <div>
              <h3>Nivel 1</h3>
            </div>
            <div style={{ width: 135 }}>
              <NivelChart chartData={nivel1Data} />
            </div>
          </Box>

          {/* ROW 3 */}
          <Box
            gridColumn="span 3"
            backgroundColor="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
          >
            <div>
              <h3>Nivel 2</h3>
            </div>
            <div style={{ width: 135 }}>
              <NivelChart chartData={nivel2Data} />
            </div>
          </Box>

          {/* ROW 4 */}
          <Box
            gridColumn="span 3"
            backgroundColor="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
          >
            <div>
              <h3>Nivel 3</h3>
            </div>
            <div style={{ width: 135 }}>
              <NivelChart chartData={nivel3Data} />
            </div>
          </Box>

          {/* ROW 2 GRAFICO IZQUIERDO!!!  */}
          <Box gridColumn="span 8" gridRow="span 3" backgroundColor="#fff">
            <Box mt="60px" p="0 30px" alignItems="center">
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Grafico de Incidencias
                </Typography>
              </Box>
              <div style={{ width: 700 }}>
                <BarChart chartData={chartData} />
              </div>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
              {/*             <LineChart isDashboard={true} /> */}
            </Box>
          </Box>
          {/* ROW 2 GRAFICO DERECHO !!!  */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor="#fff"
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Tickets Recientemente Abiertos
              </Typography>
            </Box>
            {mockTransactions.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {transaction.txId}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {transaction.user}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>{transaction.date}</Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  ${transaction.cost}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
