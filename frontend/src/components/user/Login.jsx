import React from "react";
import useForm from "../../hooks/useForm";
import { User } from "../../api/user";

const userController = new User();

export const Login = () => {
  const { form, changed } = useForm({});

  const loginUser = async (e) => {
    e.preventDefault();

    // Datos del formulario
    let userToLogin = form;

    // Peticion al backend
    const response = await userController.login(userToLogin);
    console.log(response);

    // Persistir los datos en el navegador
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  };
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={loginUser}>
        <div>
          <label>Email</label>
          <input type="email" name="email" onChange={changed} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="password" onChange={changed} />
        </div>

        <input type="submit" value="Identificate" />
      </form>
    </>
  );
};
