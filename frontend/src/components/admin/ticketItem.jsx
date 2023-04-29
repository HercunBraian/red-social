import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import moment from "moment";
import Header from "../../components/Global/Header";

export function TicketItem(props) {
  const { clientTicket } = props;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    {
      field: "client",
      headerName: "Cliente",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "user",
      headerName: "Tecnico",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "title",
      headerName: "Titulo",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "priority",
      headerName: "Prioridad",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "created_at",
      headerName: "Fecha Creacion",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.created_at).format("DD-MM-YYYY HH:MM:SS"),
    },
    {
      field: "access",
      headerName: "Acciones",
      flex: 1,
      renderCell: () => {
        return (
          <>
            <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              backgroundColor={colors.greenAccent[700]}
              borderRadius="4px"
            >
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {/*  <a href={`profile/${clientId}`}>Perfil</a> */}
              </Typography>
            </Box>
            <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
              sx={{ ml: "5px" }}
              backgroundColor={colors.greenAccent[700]}
            >
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Editar
              </Typography>
            </Box>
            <Box
              width="60%"
              m="0 auto"
              p="5px"
              display="flex"
              justifyContent="center"
              borderRadius="4px"
              backgroundColor={colors.greenAccent[700]}
              sx={{ ml: "5px" }}
            >
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                Eliminar
              </Typography>
            </Box>
          </>
        );
      },
    },
  ];

  return (
    <>
      

      <Box m="20px">
        <Header title="TICKETS" subtitle="Ultimos tickets agregados" />
        <Box m="40px 0 0 0" height="69vh">
          <DataGrid
            checkboxSelection
            getRowId={(row) => row._id}
            rows={clientTicket || []}
            /* onRowClick={(rows) => {
              getIdClient(rows.id);
            }} */
            columns={columns}
          />
        </Box>
      </Box>
    </>

  );


}