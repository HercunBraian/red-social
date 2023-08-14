import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Icono de Crear Cliente
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";

// Componente de Modal para Crear Ticket
import { BasicModal } from "../../../admin/Shared/BasicModal/BasicModal";
import { TicketForm } from "../../Ticket/TicketForm/ticketForm";
import { ClientForm } from "../../Ticket/ClientForm/ClientForm";

// Client Controller
const clientController = new Client();

const SidebarContainer = styled(Box)({
  width: "300px",
  backgroundColor: "#EEF2F6",
  paddingTop: "30px",
  width: "380px",
  height: "100vh",
  borderRight: "1px solid #e0e0e0",
  BoxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  WebkitBoxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  MozBoxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  "z-index": 1,
});

const SidebarClient = ({ handleClientSelection, setSelectedClientCoordinates  }) => {
  // Token de Autenticacion
  const { token } = useAuth();
  // Estado para almacenar la lista de Clientes
  const [clients, setClients] = useState(null);

  // Estados de paginacion
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Show Modal
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [reload, setReload] = useState(false);

  // Manejador de pagina
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  //Funcion para abrir o cerrar el modal
  const onOpenCloseModal = () => setShowModal((prevState) => !prevState);
  const onOpenCloseModal2 = () => setShowModal2((prevState) => !prevState);
  const onReload = () => setReload((prevState) => !prevState);

  // UseEffect para realizar consulta a la Api
  useEffect(() => {
    (async () => {
      try {
        const response = await clientController.list(token);
        setClients(response.clients.docs);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [clients]);

  // Filtro de clientes de Sidebar
  const filteredClients =
    clients?.filter((client) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];
    
  return (
    <SidebarContainer>
      <div>
        <TextField
          label="Buscar Cliente"
          variant="outlined"
          margin="normal"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <List>
            {filteredClients
              .slice((currentPage - 1) * 10, currentPage * 20)
              .map((client) => (
                <ListItem key={client._id}>
                  <ListItemText
                    primary={client.name}
                    secondary={client.direccion}
                    onClick={() => {
                      handleClientSelection(client._id);
                      setSelectedClientCoordinates(client.location);
                    }}
                  />
                </ListItem>
              ))}
          </List>
        </div>
        <Pagination
          count={Math.ceil(filteredClients.length / 10)}
          page={currentPage}
          onChange={handleChangePage}
          sx={{ marginTop: "auto" }}
        />

        <div>
          {/* Formulario modal para agregar nuevo cliente */}
          <AccountCircleRoundedIcon
            primary
            onClick={onOpenCloseModal2}
            style={{
              fontSize: "40px",
              color: "black",
              backgroundColor: "cornflowerblue",
              padding: "10px",
              borderRadius: "30px",
              cursor: "pointer", // Cambiar el cursor al puntero
              position: "absolute",
              top: "92vh",
              width: "36px",
              height: "36px",
              marginLeft: "170px",
            }}
          >
            Nuevo Cliente
          </AccountCircleRoundedIcon>

          {/* Botón "Crear Ticket" */}
          <AccountTreeIcon
            primary
            onClick={onOpenCloseModal}
            style={{
              fontSize: "40px",
              color: "black",
              backgroundColor: "cornflowerblue",
              padding: "10px",
              borderRadius: "30px",
              cursor: "pointer", // Cambiar el cursor al puntero
              position: "absolute",
              top: "92vh",
              width: "36px",
              height: "36px",
              marginLeft: "80px",
            }}
          >
            Nuevo Ticket
          </AccountTreeIcon>
        </div>

        {/* Formulario modal para crear ticket */}
        <BasicModal
          show={showModal}
          close={onOpenCloseModal}
          title="Crear Nuevo Ticket"
        >
          <TicketForm onReload={onReload} onClose={onOpenCloseModal} />
        </BasicModal>

        {/* Formulario modal para crear Cliente */}
        <BasicModal
          show={showModal2}
          close={onOpenCloseModal2}
          title="Nuevo Cliente"
        >
          <ClientForm onReload={onReload} onClose={onOpenCloseModal2} />
        </BasicModal>
      </div>
    </SidebarContainer>
  );
};

export default SidebarClient;
