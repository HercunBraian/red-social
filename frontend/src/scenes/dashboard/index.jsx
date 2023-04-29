import React from "react";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Global/Header";
import { mockTransactions } from "../../data/mockData";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import StatBox from "../../components/admin/Card/StateBox";
import LineChart from "../../components/admin/Dashboard/LineChart";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Autenticacion
import useAuth from "../../hooks/useAuth";

// Importamos Api de Ticket
import { Ticket } from "../../api/ticket";

const ticketController = new Ticket();

const Dashboard = () => {
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
            <StatBox
              title="Tickets Abiertos"
              subtitle={count}
              progress="0.10"
              increase="+200%"
              icon={
                <ConfirmationNumberIcon
                  sx={{ color: colors.blueAccent[600], fontSize: "45px" }}
                />
              }
            />
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
            <StatBox
              title="Tickets Cerrados"
              subtitle={countClose}
              progress="0.10"
              increase="+200%"
              icon={
                <ConfirmationNumberIcon
                  sx={{ color: colors.blueAccent[600], fontSize: "45px" }}
                />
              }
            />
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
            <StatBox
              title="Clientes Activos"
              subtitle="2.342"
              progress="0.10"
              increase="+200%"
              icon={
                <GroupsIcon
                  sx={{ color: colors.blueAccent[600], fontSize: "45px" }}
                />
              }
            />
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
            <StatBox
              title="Entregas Pendientes"
              subtitle="2.342"
              progress="0.10"
              increase="+200%"
              icon={
                <LocalShippingIcon
                  sx={{ color: colors.blueAccent[600], fontSize: "45px" }}
                />
              }
            />
          </Box>

           {/* ROW 2 GRAFICO IZQUIERDO!!!  */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#fff"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Grafico de Incidencias
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
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
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
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
