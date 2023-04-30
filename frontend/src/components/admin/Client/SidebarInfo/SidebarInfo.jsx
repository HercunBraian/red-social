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
    borderLeft: "1px solid #e0e0e0",
    "box-shadow": "10px 1px 5px -6px rgba(0,0,0,0.1)",
    "-webkit-box-shadow": "10px 1px 5px -6px rgba(0,0,0,0.1)",
    "-moz-box-shadow": "10px 1px 5px -6px rgba(0,0,0,0.1)", 
    "z-index": 1,
  });

  const SidebarItem = {
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "5px"
  };

 
  const SidebarInfo = ({ handleClientSelection, handleReturn }) => {
  // Token de Autenticacion
  const { token } = useAuth();
  // Estado para almacenar la lista de Clientes
  const [clients, setClients] = useState(null);

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

  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

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
          <h1>Probando</h1>
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

export default SidebarInfo;
