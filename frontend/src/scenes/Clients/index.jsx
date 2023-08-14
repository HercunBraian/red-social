import React, { useState } from "react";
import { Tab } from "semantic-ui-react";
import "./Clients.css";

// Componentes
import SidebarClient from "../../components/admin/Client/Sidebar";
import { ListTickets } from "../../components/admin/Client/ListTickets/ListTickets";
import SidebarInfo from "../../components/admin/Client/SidebarInfo/SidebarInfo";
import TicketModal from "../../components/admin/Client/TicketModal/TicketModal";
import { ListMachine } from "../../components/admin/Client/ListMachine/ListMachine";
import Map from "../../components/admin/Mapa/Mapa";

const Clients = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientCoordinates, setSelectedClientCoordinates] = useState(null);

  const handleClientSelection = (clientId) => {
    setSelectedClient(clientId);
  };

  // Funcion para desmontar componente y setear en null el estado de SelectedClient

  const handleGoBack = () => {
    setSelectedClient(null);
  };

  console.log(selectedClientCoordinates)

  const customers = [
    {
      id: 1,
      name: "Cliente 1",
      location: {
        latitude: -34.57496634584861,
        longitude: -58.424100386297404
      },
      direccion: "Dirección 1",
      email: "cliente1@example.com",
      phone: "1234567890",
    },
    {
      id: 2,
      name: "Cliente 2",
      location: {
        latitude: -34.725597998554605,
        longitude: -58.26605261264482
      },
      direccion: "Dirección 2",
      email: "cliente2@example.com",
      phone: "9876543210",
    },
    // Agrega más objetos de clientes si es necesario
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleMarkerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const panes = [
    {
      menuItem: "Mapa",
      render: () => (
        <Tab.Pane attached={false}>
          <div>
            <Map customers={customers} onMarkerClick={handleMarkerClick} selectedClientCoordinates={selectedClientCoordinates} />
            {selectedCustomer && (
              <div>
                <p>Selected Customer: {selectedCustomer.name}</p>
              </div>
            )}
          </div>
        </Tab.Pane>
      ),
    },
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
          <ListMachine selectedClient={selectedClient} />
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
  ];

  return (
    <>
      <div className="content-client">
        {selectedClient ? (
          <SidebarInfo client={selectedClient} onGoBack={handleGoBack} />
        ) : (
          <SidebarClient
          handleClientSelection={handleClientSelection}
          setSelectedClientCoordinates={setSelectedClientCoordinates}
        />
        )}
        <div className="content-panes">
          <Tab menu={{ secondary: true }} panes={panes} />
        </div>
      </div>
    </>
  );
};

export default Clients;
