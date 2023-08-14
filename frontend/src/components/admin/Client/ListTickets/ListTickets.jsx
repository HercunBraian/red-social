import React, { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { size } from "lodash";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";

import "./ListTickets.css";
import TicketModal from "../TicketModal/TicketModal";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";

const clientController = new Client();

export function ListTickets(props) {
  const { selectedClient } = props;
  const { token } = useAuth();
  const [clients, setClients] = useState([]);

  // Paginacion con DataGrid
  const [pageSize, setPageSize] = useState(5);

  // Estado para que no se auto ejecute el boton abrir modal.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const handleCloseModal = () => {
    setSelectedTicketId(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      field: "title",
      headerName: "Titulo",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "client",
      headerName: "Cliente",
      flex: 1,
      valueGetter: (params) => params.row.client.name,
    },
    {
      field: "user",
      headerName: "Tecnico",
      flex: 1,
      valueGetter: (params) => params.row.user.name,
    },
    {
      field: "priority",
      headerName: "Prioridad",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Estado",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Fecha Creación",
      flex: 1,
      renderCell: (params) =>
        moment(params.row.created_at).format("DD-MM-YYYY"),
    },
  ];

  const handleRowClick = (params) => {
    setSelectedClientId(params.id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    (async () => {
      try {
        setClients(null);
        const response = await clientController.listTickets(
          token,
          selectedClient
        );
        setClients(response.tickets);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedClient]);

  if (!clients) return <Loader active inline="centered" />;
  if (size(clients) === 0) return "No tiene tickets asignados";

  return (
    <div className="box-grid">
      <h2 className="title-box">Ultimos Tickets</h2>
      <div style={{ height: "400px", backgroundColor: "#ffff" }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={clients || []}
          onRowClick={handleRowClick}
          columns={columns}
          sortModel={[
            {
              field: "created_at",
              sort: "asc", // Orden ascendente
            },
          ]}
          rowsPerPageOptions={[5, 10, 20]}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />

        {isModalOpen && (
          <TicketModal
            idTicket={selectedClientId}
            closeModal={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}
