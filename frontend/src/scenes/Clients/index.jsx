import React, { useState, useEffect } from "react";
import { Tab, Button } from "semantic-ui-react";

import { Client } from "../../api/client";
import useAuth from "../../hooks/useAuth";

// Componentes
import SidebarClient from "../../components/admin/Client/Sidebar";
import { ListTickets } from "../../components/admin/Client/ListTickets/ListTickets";
import SidebarInfo from "../../components/admin/Client/SidebarInfo/SidebarInfo";

const clientController = new Client();


const Clients = () => {
  const { token } = useAuth();

  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientSelection = (clientId) => {
    setSelectedClient(clientId);
  };

  // Funcion para desmontar componente y setear en null el estado de SelectedClient

  const handleGoBack = () => {
    setSelectedClient(null);
  };

  const panes = [
    {
      menuItem: "Tickets",
      render: () => (
        <Tab.Pane attached={false}>
          <ListTickets selectedClient={selectedClient} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Inventario",
      render: () => (
        <Tab.Pane attached={false}>
    
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Seguimientos",
      render: () => (
        <Tab.Pane attached={false}>
          <h2>Seguimientos Listado</h2>
          <h2>{selectedClient}</h2>
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
          <SidebarInfo client={selectedClient} onGoBack={handleGoBack} />
        ) : (
          <SidebarClient handleClientSelection={handleClientSelection} />
        )}
        <div className="content-panes">
          <Tab menu={{ secondary: true }} panes={panes} />
        </div>
      </div>
    </>
  );
};

export default Clients;
