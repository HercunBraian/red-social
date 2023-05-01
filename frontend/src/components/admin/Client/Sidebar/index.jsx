import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";

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

 
const SidebarClient = ({ handleClientSelection }) => {
  // Token de Autenticacion
  const { token } = useAuth();
  // Estado para almacenar la lista de Clientes
  const [clients, setClients] = useState(null);

  // Estados de paginacion
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

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
  }, []);

  // Manejador de pagina
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  // Filtro de clientes de Sidebar
  const filteredClients = clients?.filter((client) =>
  client.name.toLowerCase().includes(searchValue.toLowerCase())
) || [];


  return (
    <SidebarContainer>
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
                  onClick={() => handleClientSelection(client._id)}
                  
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
    </SidebarContainer>
  );
};

export default SidebarClient;
