import React from "react";
import useForm from "../../../hooks/useForm";
import {Form} from "semantic-ui-react"
import { User } from "../../../api/user";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./LoginForm";

const userController = new User();

export const Login = () => {
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema : validationSchema(),
    validationOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await userController.login(formValue);
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <>
      <h1>Login</h1>
     {/*  <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" 
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email} />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="password" 
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.errors.password}
          />
        </div>

        <input type="submit" value="Identificate" />
      </form> */}

      <Form onSubmit={formik.handleSubmit}>
          <Form.Input 
          name="email" 
          placeholder="Correo Electronico" 
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email}
          />
          <Form.Input 
          name="password" 
          placeholder="Contraseña" 
          onChange={formik.handleChange}
          value={formik.values.password}
          error={formik.errors.password}
          />
          <Form.Button type='submit' primary fluid loading={formik.isSubmitting}> Entrar </Form.Button>
        </Form>
    </>
  );
};
