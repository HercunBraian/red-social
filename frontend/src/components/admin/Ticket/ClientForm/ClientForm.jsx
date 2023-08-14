import React from "react";
import { Form} from "semantic-ui-react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ClientFormValidation";
import { Client } from "../../../../api/client";

import useAuth from "../../../../hooks/useAuth";

const clientController = new Client();

export function ClientForm(props) {
  const { token } = useAuth();
  const { onClose, onReload } = props;

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validationOnChange: false,

    onSubmit: async (formValue) => {
      try {
        const response = await clientController.createClient(token, formValue);
        onReload();
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Input
        fluid
        label="Nombre Cliente"
        name="name"
        placeholder="Nombre Cliente"
        onChange={formik.handleChange}
        value={formik.values.name}
        error={formik.errors.name}
      />

      <Form.Input
        fluid
        label="Email"
        name="email"
        placeholder="Ingresar Email"
        onChange={formik.handleChange}
        value={formik.values.email}
        error={formik.errors.email}
      />

      <Form.Input
        fluid
        label="Celular"
        name="phone"
        placeholder="Ingresar Celular"
        onChange={formik.handleChange}
        value={formik.values.phone}
        error={formik.errors.phone}
      />

      <Form.Input
        fluid
        label="Direccion"
        name="direccion"
        placeholder="Ingresar Direccion"
        onChange={formik.handleChange}
        value={formik.values.direccion}
        error={formik.errors.direccion}
      />

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        Crear Cliente
      </Form.Button>
    </Form>
  );
}
