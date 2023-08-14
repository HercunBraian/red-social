import React, { useEffect, useState } from "react";
import { Button, Loader } from "semantic-ui-react";
import { Box, Typography, useTheme } from "@mui/material";
import { size, map } from "lodash";
import TicketModal from "../TicketModal/TicketModal";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import "./ListMachine.css";
import { DataGrid } from "@material-ui/data-grid";
import moment from "moment";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";
import { Machine } from "../../../../api/machine";

const clientController = new Client();
const machineController = new Machine();

export function ListMachine(props) {
  const theme = useTheme();
  const { selectedClient } = props;
  const { token } = useAuth();
  const [clients, setClients] = useState([]);

  // Estado para que no se auto ejecute el boton abrir modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachinetId, setSelectedMachineId] = useState(null);
  const [infoMachine, setInfoMachine] = useState(null);
  const [countRepair, setCountRepair] = useState(null);

  const handleOpenModal = (machineId) => {
    setSelectedMachineId(machineId);
    setIsModalOpen(true);
  };

  // Funcion para desmontar componente y setear en null el estado de SelectedClient
  const handleGoBack = () => {
    setSelectedMachineId(null);
  };

  const handleCloseModal = () => {
    setSelectedMachineId(null);
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

  // useEffect para obtener la informacion de la maquina
  useEffect(() => {
    (async () => {
      try {
        setInfoMachine(null);
        console.log("id?", selectedMachinetId);
        // Agregar una validación para evitar enviar null en la URL
        if (selectedMachinetId !== null) {
          const response = await machineController.perfilMachine(
            token,
            selectedMachinetId
          );
          setInfoMachine(response.perfil); // Asumo que el objeto que recibes de la API tiene la propiedad 'perfil'
          console.log("probando", response.perfil);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedMachinetId, token]); // Agregar selectedMachinetId y token como dependencias aquí

  // useEffect para obtener la informacion de reparaciones por mes de maquina
  useEffect(() => {
    (async () => {
      try {
        setCountRepair(null);
        console.log("id?", selectedMachinetId);
        // Agregar una validación para evitar enviar null en la URL
        if (selectedMachinetId !== null) {
          const response = await machineController.countRepairTotal(
            token,
            selectedMachinetId
          );
          setCountRepair(response);
          console.log("probando cantidad de reparacion", response);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedMachinetId, token]); // Agregar selectedMachinetId y token como dependencias aquí

  if (!clients) return <Loader active inline="centered" />;
  if (size(clients) === 0) return "No tiene maquinas instaladas";

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

  const columnsTickets = [
    {
      field: "trackingId",
      headerName: "ID",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "user",
      headerName: "Tecnico",
      flex: 1,
      cellClaseName: "name-column--cell",
      valueGetter: (params) => params.row.user.name,
    },
    {
      field: "department",
      headerName: "Sector",
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
      field: "visit",
      headerName: "Motivo Visita",
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
  ];
  return (
    <>
      {selectedMachinetId ? (
        <>
          <ReplyAllIcon onClick={handleGoBack}>Volver</ReplyAllIcon>

          <div className="box-grid">
            {infoMachine && (
              <div>
                <h1>Información de la Máquina</h1>
                <p>Nombre: {infoMachine.name}</p>
                <p>Modelo: {infoMachine.model}</p>
                <p>Reparaciones Totales: {countRepair.reparaciones}</p>
              </div>
            )}
          </div>
          <br></br>
          <div className="box-grid">
            <div
              style={{ height: 400, width: "100%", backgroundColor: "#ffff" }}
            >
              {infoMachine && infoMachine.tickets ? (
                <DataGrid
                  checkboxSelection
                  getRowId={(row) => row._id}
                  rows={infoMachine.tickets}
                  columns={columnsTickets}
                />
              ) : (
                <p>No hay tickets disponibles.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="box-grid">
          <h2 className="title-box">Equipamiento Instalado</h2>
          <div style={{ height: 400, width: "100%", backgroundColor: "#ffff" }}>
            <DataGrid
              checkboxSelection
              getRowId={(row) => row._id}
              rows={clients || []}
              columns={columns}
              selectionModel={selectedMachinetId ? [selectedMachinetId] : []}
              onSelectionModelChange={(newSelection) => {
                setSelectedMachineId(
                  newSelection.length > 0 ? newSelection[0] : null
                );
              }}
            />
          </div>
        </div>
      )}
    </>
  );
  /* return map(clients, (client) => (
    <div className="user-item" key={client._id}>
      <div className="user-item__info">
        <div>
          <div className="display-flex">
            <BuildIcon />
            <p className="ticket-date">{client.created_at} </p>
            <p
              className={
                client.status === "Cerrado"
                  ? "ticket-status-cerrado"
                  : client.status === "Pendiente"
                  ? "ticket-status-pendiente"
                  : client.status === "En Proceso"
                  ? "ticket-status-proceso"
                  : client.status === "Cancelado"
                  ? "ticket-status-cancelado"
                  : ""
              }
            >
              {client.status}
            </p>
          </div>

          <p className="ticket-tecnico">{client.name}</p>
        </div>
      </div>
      <div className="user-item__visit">
        <RemoveRedEyeIcon className="user-item__eye" />
        <Button onClick={() => handleOpenModal(client._id)}>
          Abrir Modal
        </Button>
      </div>
      {selectedTicketId === client._id && isModalOpen && (
        <TicketModal
          idTicket={client._id}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  )); */
}
