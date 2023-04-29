import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Client } from "../../api/client";
import useAuth from "../../hooks/useAuth";
import moment from "moment";

//Importar Componentes
import Header from "../../components/Global/Header";
import ClientRegister from "../../components/admin/Client/ClientForm/registerClient";

const clientController = new Client();

const Clients = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [reload, setReload] = useState(false);

  // Paginacion con DataGrid
  const [pageSize, setPageSize] = useState(5);

  const onReload = () => setReload((prevState) => !prevState);

  useEffect(() => {
    (async () => {
      try {
        const response = await clientController.list(token);
        setClients(response.clients.docs);
        console.log(response.clients.docs);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [reload]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const getIdClient = (params) => {
    setClientId(params);
    console.log(params);
  };
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "direccion",
      headerName: "Direccion",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
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
                <a href={`profile/${clientId}`}>Perfil</a>
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
    <Box m="20px">
      <Header title="TEAM" subtitle="Managing the Team Members" />
      {/* <Button variant="contained" color="secondary" href="client/registrar">
  Nuevo Cliente
</Button> */}

      <Box>
        <ClientRegister onReload={onReload} />
      </Box>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-row": {
            borderBottom: colors.blueAccent[700],
          },
          "& .MuiDataGrid-cellContent": {
            fontSize: "15px",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          getRowId={(row) => row._id}
          rows={clients || []}
          onRowClick={(rows) => {
            getIdClient(rows.id);
          }}
          columns={columns}
          rowsPerPageOptions={[5, 10, 20]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </Box>
    </Box>
  );
};

export default Clients;
