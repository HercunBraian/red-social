import { useState, useEffect } from "react";
import { ENV } from "../../config/config";
import { useParams } from "react-router-dom";

const ClientDetailContainer = () => {
  const [userProfile, setUserProfile] = useState({});

  const { clientId } = useParams();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.ClientPerfil}/${clientId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await request.json();

    if (data.status === "success") {
      setUserProfile(data.client);
    }
    console.log(data, userProfile);
  };

  return (
    <>
      <h1>{userProfile.name} </h1>
      <h1>{userProfile.direccion} </h1>
      <h1>{userProfile.email} </h1>
      <h1>{userProfile.phone} </h1>
    </>
  );
};

export default ClientDetailContainer;
