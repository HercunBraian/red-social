import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const SidebarContainer = styled(Box)({
  width: "300px",
  borderRight: "1px solid #e0e0e0",
  
  
});


const clients = [
    { id: 1, name: "Cliente 1" },
    { id: 2, name: "Cliente 2" },
    { id: 3, name: "Cliente 3" },
    { id: 4, name: "Cliente 4" },
    { id: 5, name: "Cliente 5" },
    { id: 6, name: "Cliente 6" },
    { id: 7, name: "Cliente 7" },
    { id: 8, name: "Cliente 8" },
    { id: 9, name: "Cliente 9" },
    { id: 10, name: "Cliente 10" },
    { id: 11, name: "Cliente 11" },
    { id: 12, name: "Cliente 12" },
    { id: 13, name: "Cliente 13" },
    { id: 14, name: "Cliente 14" },
    { id: 15, name: "Cliente 15" },
    { id: 16, name: "Cliente 16" },
    { id: 17, name: "Cliente 17" },
    { id: 18, name: "Cliente 18" },
    { id: 19, name: "Cliente 19" },
    { id: 20, name: "Cliente 20" },
  ];
  

const SidebarClient = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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
            <ListItem key={client.id}>
              <ListItemText primary={client.name} />
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
