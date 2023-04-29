import React, { useState, useEffect } from "react";
import { ENV } from "../../../config/config";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { TicketItem } from "../../../components/admin/ticketItem";
import { MachineItem } from "../../../components/admin/Client/machineItem"
import Sidebar from "../../../components/admin/Client/Sidebar";

const ClientDetailContainer = () => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState({});

  // useState Tickets
  const [clientTicket, setClientTicket] = useState({});

  // useState Machines
  const [clientMachine, setClientMachine] = useState({});

  const { clientId } = useParams();

  useEffect(() => {
    getProfile();
    getTickets();
    getMachines();
  }, []);

  const getProfile = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.ClientPerfil}/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      }
    );

    const data = await request.json();

    if (data.status === "success") {
      setUserProfile(data.client);
    }
  };

  const getTickets = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.ClientListTicket}/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      }
    );

    const data = await request.json();
    if (data.status === "Success") {
      setClientTicket(data.tickets);
    }

  };

  const getMachines = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.ClientListMachine}/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      }
    );

    const data = await request.json();
    if (data.status === "Success") {
      setClientMachine(data.machines);
    }
    console.log(clientTicket)
  };

  return (
    <>
      <h1>{userProfile.name} </h1>
      <h1>{userProfile.direccion} </h1>
      <h1>{userProfile.email} </h1>
      <h1>{userProfile.phone} </h1>

      <div>
        {clientTicket != 0 ? <TicketItem clientTicket={clientTicket} /> : <h1>El cliente no tiene tickets asignados</h1> }
        
      </div>

      <div>
      {clientMachine != 0 ? <MachineItem clientMachine={clientMachine} /> : <h1>El cliente no tiene equipos asignados</h1> }
      </div>

    <Sidebar />
    </>
  );
};

export default ClientDetailContainer;

