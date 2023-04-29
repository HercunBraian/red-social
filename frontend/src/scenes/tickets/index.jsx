import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Ticket } from "../../api/ticket";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import "./ticket.css";

// Importaciones de Semantic-UI
import { Button, Confirm } from "semantic-ui-react";
import { BasicModal } from "../../components/admin/Shared/BasicModal/BasicModal";

//Importar Componentes
import Header from "../../components/Global/Header";
import { TicketForm } from "../../components/admin/Ticket/TicketForm/ticketForm";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const ticketController = new Ticket();

const Tickets = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null);

  // Paginacion con DataGrid
  const [pageSize, setPageSize] = useState(10);

  // Show Modal
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [reload, setReload] = useState(false);

  // Modal para Confirmar Eliminacion de Item
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [ticketInfoId, setTicketInfoId] = useState(null);

  //Funcion para abrir o cerrar el modal
  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);

  //Funcion para abrir o cerrar el modal de eliminacion de item
  const onOpenCloseConfirm = () => {
    setShowConfirm((prevState) => !prevState);
  };
  const onReload = () => setReload((prevState) => !prevState);

  // Funcion para eliminar item
  const openDeleteConfirm = (title, ticketId) => {
    setIsDelete(true);
    setTicketInfoId(ticketId); // Almacena el id en el estado
    setConfirmMessage(`Eliminar el Ticket: ${title}`);
    onOpenCloseConfirm();
  };

  const onDelete = async () => {
    try {
      await ticketController.deleteTicket(token, ticketInfoId);
      onReload();
      setShowConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  //Funcion para abrir o cerrar el modal de update
  const onOpenCloseModalUpdate = () =>
    setShowModalUpdate((prevState) => !prevState);

  useEffect(() => {
    (async () => {
      try {
        const response = await ticketController.list(token);
        setTickets(response.tickets);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [reload]);

  // Titulo de modal
  const openUpdateTicket = (title) => {
    setTitleModal(`Actualizar Ticket: ${title}`);
    onOpenCloseModalUpdate();
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleEdit = async (id) => {
    setClientId(id);
    try {
      const response = await ticketController.getTicket(token, id);
      setTicketInfo(response.ticket);
      const title = response.ticket.title;
      openUpdateTicket(title);
    } catch (error) {
      console.error(error);
    }
  };

  const ticketId = async (id) => {
    setClientId(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await ticketController.getTicket(token, id);
      setTicketInfo(response.ticket);
      const ticketId = response.ticket._id;
      const title = response.ticket.title;
      openDeleteConfirm(title, ticketId);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      field: "trackingId",
      headerName: "N° Seguimiento",
      width: 100,
    },
    {
      field: "title",
      headerName: "Titulo",
      width: 160,
    },
    {
      field: "client",
      headerName: "Cliente",
      width: 160,
      valueGetter: (params) => params.row.client.name,
    },
    {
      field: "user",
      headerName: "Tecnico",
      width: 120,
      valueGetter: (params) => params.row.user.name,
    },
    {
      field: "priority",
      headerName: "Prioridad",
      width: "70",
    },
    {
      field: "status",
      headerName: "Estado",
      width: "90",
      renderCell: ({ row: { status } }) => {
        return (
          <Box
            width="100%"
            p="5px"
            backgroundColor={
              status === "En Proceso"
                ? "#0de60e"
                : status === "Pendiente"
                ? "#513bfe"
                : status === "Cerrado"
                ? "#ff0001"
                : colors.grey[500] // valor por defecto si no se cumple ninguna de las condiciones anteriores
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },

    {
      field: "department",
      headerName: "Sector",
      width: "95",
    },
    {
      field: "created_at",
      headerName: "Fecha Creacion",
      renderCell: (params) =>
        moment(params.row.created_at).format("DD-MM-YYYY HH:MM:SS"),
    },

    {
      field: "access",
      headerName: "Acciones",
      width: "130",
      renderCell: ({ id }) => (
        <>
          <Box
            width="100"
            m="0 auto"
            p="2.9px 5px"
            display="flex"
            justifyContent="center"
            alignItems="center" // Agregamos esta propiedad para centrar verticalmente
            borderRadius="4px"
            sx={{ ml: "5px" }}
            backgroundColor={colors.blueAccent[600]}
            onClick={() => ticketId(id)}
          >
            <Typography color={colors.grey[100]}>
              <a href={`ticket/${clientId}`} style={{ textDecoration: "none" }}>
                <SearchRoundedIcon style={{ color: colors.grey[100] }} />
              </a>
            </Typography>
          </Box>

          <Box
            width="100"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
            sx={{ ml: "5px" }}
            backgroundColor={colors.blueAccent[600]}
            onClick={() => handleEdit(id)}
          >
            <EditRoundedIcon style={{ cursor: "pointer" }} />
          </Box>

          <Box
            width="100"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            borderRadius="4px"
            sx={{ ml: "5px" }}
            backgroundColor={colors.blueAccent[600]}
            onClick={() => handleDelete(id)}
          >
            <DeleteRoundedIcon style={{ cursor: "pointer" }} />
          </Box>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 1,
        }}
      >
        <Header title="Tickets" />

        <Button primary onClick={onOpenCloseModal}>
          Nuevo Ticket
        </Button>
      </Box>

      <BasicModal
        show={showModal}
        close={onOpenCloseModal}
        title="Crear Nuevo Ticket"
      >
        <TicketForm
          onReload={onReload}
          onClose={onOpenCloseModal}
          clientId={clientId}
        />
      </BasicModal>

      <BasicModal
        show={showModalUpdate}
        close={onOpenCloseModalUpdate}
        title={titleModal}
      >
        <TicketForm
          onReload={onReload}
          onClose={onOpenCloseModalUpdate}
          ticketInfo={ticketInfo}
        />
      </BasicModal>

      <Confirm
        open={showConfirm}
        onCancel={onOpenCloseConfirm}
        onConfirm={isDelete ? onDelete : null}
        content={confirmMessage}
        size="mini"
      />

      <Box
        m="40px 0 0 0"
        height="75vh"
        borderRadius={"12px"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "#3c3c3c",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-row": {
            borderBottom: "colors.blueAccent[700]",
          },
          "& .MuiDataGrid-cellContent": {
            fontSize: "15px",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#a4a9fc",
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            fontSize: "15px",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#a4a9fc",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <div style={{ height: "500px", width: "100%", overflowY: "auto" }}>
          <DataGrid
            autoWidth
            getRowId={(row) => row._id}
            rows={tickets || []}
            columns={columns}
            rowsPerPageOptions={[5, 10, 20]}
            pageSize={pageSize}
            columnBuffer={100}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        </div>
      </Box>
    </Box>
  );
};

export default Tickets;
