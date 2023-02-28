import React, { useState, useEffect, createContext } from "react";
import { User } from "../api/user";
import { ENV } from "../config/config";

const userController = new User();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    authUser();
  }, []);

  const authUser = async () => {
    // Sacar datos del usuario Identificado del LocalStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // Comprobar si tengo el token y el user
    if (!token || !user) {
      return false;
    }

    // Transformar los datos a un objeto JS
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    // Peticion Ajax al backend que compruebe el token
    const baseApi = ENV.BASE_API;
    const request = await fetch(
      `${baseApi}/${ENV.API_ROUTES.UserPerfil}/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await request.json();

    setAuth(data.user);
    /*  const response = await userController.perfil(userId);
    setAuth(response.user);
    console.log(auth); */
    // Y que me devuelva todos los datos del usuario

    // Setear el estado de Auth
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
