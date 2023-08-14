import React, { useEffect, useState } from "react";
import { Button, Loader } from "semantic-ui-react";
import { Box, Typography, useTheme } from "@mui/material";
import { size, map } from "lodash";
import TicketModal from "../TicketModal/TicketModal";
import { DataGrid } from "@material-ui/data-grid";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";

const clientController = new Client();

export function PerfilMachine(props) {
  const theme = useTheme();
  const { selectedClient } = props;
  const { token } = useAuth();
  const [clients, setClients] = useState([]);

  // Estado para que no se auto ejecute el boton abrir modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const handleOpenModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTicketId(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      try {
        setClients(null);
        const response = await clientController.listMachines(
          token,
          selectedClient
        );
        setClients(response.machines);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedClient]);

  if (!clients) return <Loader active inline="centered" />;
  if (size(clients) === 0) return "No tiene tickets asignados";

  console.log(clients);

  const columns = [
    {
      field: "name",
      headerName: "Equipo",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "model",
      headerName: "Modelo",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "serial",
      headerName: "N° Serie",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "ubi",
      headerName: "Ubicacion",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "version",
      headerName: "Version Software",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
  ];
  
  return (
    <>
      <div style={{ height: 400, width: "100%" }}>
      <DataGrid
            checkboxSelection
            getRowId={(row) => row._id}
            rows={clients || []}
            columns={columns}
          />
      </div>
    </>
  );
}
