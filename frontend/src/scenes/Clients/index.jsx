import React, { useState, useEffect } from "react";
import { Tab, Button } from "semantic-ui-react";

import { Client } from "../../api/client";
import useAuth from "../../hooks/useAuth";

// Componentes
import SidebarClient from "../../components/admin/Client/Sidebar";
import { ListTickets } from "../../components/admin/Client/ListTickets/ListTickets";
import SidebarInfo from "../../components/admin/Client/SidebarInfo/SidebarInfo";

const clientController = new Client();

const tabStyle = {
  "background-color": "#EEF2F6",
  "box-shadow": "-2px 13px 5px -6px rgba(0,0,0,0.07)",
  "-webkit-box-shadow": "-2px 13px 5px -6px rgba(0,0,0,0.07)",
  "-moz-box-shadow": "-2px 13px 5px -6px rgba(0,0,0,0.07)",
};

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const { token } = useAuth();

  const handleClientSelection = (clientId) => {
    setSelectedClient(clientId);
  };
  const panes = [
    {
      menuItem: "Tickets",
      render: () => (
        <Tab.Pane attached={false}  >
          <ListTickets selectedClient={selectedClient}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Seguimientos",
      render: () => (
        <Tab.Pane attached={false} >
          <h2>Seguimientos Listado</h2>
          <h2>{selectedClient}</h2>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Inventario",
      render: () => (
        <Tab.Pane attached={false}  >
          <ListTickets selectedClient={selectedClient}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Contacto",
      render: () => (
        <Tab.Pane attached={false}  >
          <ListTickets selectedClient={selectedClient}/>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Mapa",
      render: () => (
        <Tab.Pane attached={false}>
          <h2>Mapa</h2>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <div className="content-client">
        
      {selectedClient ? (
<SidebarInfo client={selectedClient} />
) : (
<SidebarClient handleClientSelection={handleClientSelection} />
)}
        <div className="content-panes">
          <Tab menu={{ secondary: true }} panes={panes} style={tabStyle} />
        </div>
      </div>
    </>
  );
};

export default Clients;
