import React, { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { Image, Button, Icon, Confirm } from "semantic-ui-react";
import BuildIcon from "@mui/icons-material/Build";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { size, map } from "lodash";
import "./ListTickets.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

// Importacion de Auth y de Api de Client
import useAuth from "../../../../hooks/useAuth";
import { Client } from "../../../../api/client";

const clientController = new Client();

export function ListTickets(props) {
  const { selectedClient } = props;
  const { token } = useAuth();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setClients(null);
        const response = await clientController.listTickets(
          token,
          selectedClient
        );
        setClients(response.tickets);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedClient]);

  if (!clients) return <Loader active inline="centered" />;
  if (size(clients) === 0) return "No tiene tickets asignados";

  /* return map(clients, (client) => <UserItem key={user._id} user={user} onReload={onReload} />); */
  return map(clients, (client) => (
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

          <p className="ticket-tecnico">{client.user.name}</p>
          <p className="ticket-deparment">{client.department}</p>
        </div>
      </div>
      <div className="user-item__visit">
        <RemoveRedEyeIcon className="user-item__eye"/>
        <p className="ticket-visit">{client.visit} </p>
      </div>
    </div>
  ));
}
