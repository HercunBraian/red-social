import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import "./SidebarInfo.css";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

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
  boxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  WebkitBoxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  MozBoxShadow: "10px 1px 5px -6px rgba(0,0,0,0.1)",
  "z-index": 1,
});

const SidebarInfo = ({ onGoBack, client }) => {
  // Token de Autenticacion
  const { token } = useAuth();
  // Estado para almacenar la lista de Clientes
  const [clientInfo, setClientInfo] = useState(null);

  // UseEffect para realizar consulta a la Api
  useEffect(() => {
    (async () => {
      try {
        const response = await clientController.perfilClient(client, token);
        setClientInfo(response);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <SidebarContainer>
      <div className="client-info">
        <ReplyAllIcon className="client-info__back" onClick={onGoBack}>Volver</ReplyAllIcon>

        <div className="client-info__name">
          <h4>{clientInfo?.client.name}</h4>
          <p>Cliente</p>
        </div>
        <hr></hr>
        <div className="client-info__client">
          <p>N° de Cliente:</p>
          <h4>INH-019 / CLIENTE SALESFORCE N° 118</h4>
        </div>
        <hr></hr>
        <div className="client-info__client">
          <p>Contrato:</p>
          <h4>Cliente Total Care</h4>
        </div>
        <hr></hr>
        <div className="client-info__client">
          <p>Direccion:</p>
          <h4>{clientInfo?.client.direccion}</h4>
        </div>
        <hr></hr>
        <div className="client-info__client">
          <p>Email:</p>
          <h4>{clientInfo?.client.email}</h4>
        </div>
        <hr></hr>
        <div className="client-info__client">
          <p>Telefono:</p>
          <h4>{clientInfo?.client.phone}</h4>
        </div>
        <hr></hr>
      </div>
    </SidebarContainer>
  );
};

export default SidebarInfo;
