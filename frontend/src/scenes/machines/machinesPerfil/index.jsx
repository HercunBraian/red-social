import { useState, useEffect } from "react";
import { ENV } from "../../../config/config";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const MachineDetailContainer = () => {
  const {token} = useAuth();
  const [userMachine, setMachineProfile] = useState({});
  const [useMachineClient, setMachineClient] = useState({});

  const { machineId } = useParams();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.MachinePerfil}/${machineId}`,
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
      setMachineProfile(data.perfil);
      setMachineClient(data.perfil.client);
    }
    console.log(userMachine);
  };

  return (
    <>
      <h1>{userMachine.name}</h1>
      <h1>{userMachine.serial}</h1>
      <h1>{userMachine.model}</h1>
      <h1>{userMachine.ubi}</h1>
      <h1>{useMachineClient.name}</h1>

    </>
  );
};

export default MachineDetailContainer;
