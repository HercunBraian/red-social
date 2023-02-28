import React from "react";
import useForm from "../../hooks/useForm";
import { User } from "../../api/user";
import useAuth from "../../hooks/useAuth";

const userController = new User();

export const Register = () => {
  const { auth } = useAuth();
  console.log(auth);
  const { form, changed } = useForm({});

  const saveUser = async (e) => {
    // Prevenir actualizacion de pantalla
    e.preventDefault();

    // Recoger datos del formulario
    let newUser = form;

    // Creamos el usuario
    const response = await userController.register(newUser);
    console.log(response);
  };
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={saveUser}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input type="text" name="name" onChange={changed} />
        </div>
        <div>
          <label htmlFor="surname">Apellido</label>
          <input type="text" name="surname" onChange={changed} />
        </div>
        <div>
          <label htmlFor="nick">Nick</label>
          <input type="text" name="nick" onChange={changed} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" onChange={changed} />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input type="password" name="password" onChange={changed} />
        </div>

        <input type="submit" value="Registrarse" />
      </form>
    </>
  );
};
