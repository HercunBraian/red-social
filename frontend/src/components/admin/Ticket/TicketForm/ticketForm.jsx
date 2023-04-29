import React from "react";
import { useState, useEffect } from "react";
import { Form, TextArea, Select } from "semantic-ui-react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ticketValidationForm";
import { Ticket } from "../../../../api/ticket";
import { Client } from "../../../../api/client";

import useAuth from "../../../../hooks/useAuth";

const ticketController = new Ticket();
const clientController = new Client();

export function TicketForm(props) {
  const { token } = useAuth();
  const { onClose, onReload, ticketInfo } = props;

  // Input de clientes
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  /* const [busqueda, setBusqueda] = useState(""); */

  useEffect(() => {
    // Creamos una funcion anonima auto ejecutable
    (async () => {
      try {
        const response = await clientController.list(token);
        setClientes(response.clients.docs);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formik = useFormik({
    initialValues: initialValues(ticketInfo),
    validationSchema: validationSchema(),
    validationOnChange: false,

    onSubmit: async (formValue) => {
      console.log(formValue);
      try {
        const data = {
          title: formValue.title,
          client: formValue.client,
          obs: formValue.obs,
          priority: formValue.priority,
          department: formValue.department,
          status: formValue.status,
        };
        if (!ticketInfo) {
          await ticketController.createTicket(token, data);
        } else {
          await ticketController.updateTicket(token, ticketInfo._id, data);
        }
        onReload();
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const clientArray = clientesFiltrados.map((client) => client);

  const optionClients = clientArray.map((nombre) => {
    let value = nombre.name;
    if (typeof value !== "boolean" && isNaN(Number(value))) {
      value = value.toString();
    } else {
      value = Number(value);
    }
    return {
      key: nombre._id,
      text: nombre.name,
      value,
    };
  });

  const options = [
    { key: "1", text: "Baja", value: "Baja" },
    { key: "2", text: "Media", value: "Media" },
    { key: "3", text: "Alta", value: "Alta" },
  ];

  const status = [
    { key: "1", text: "Pendiente", value: "Pendiente" },
    { key: "2", text: "En Proceso", value: "En Proceso" },
    { key: "3", text: "Cerrado", value: "Cerrado" },
  ];

  const optionsSector = [
    { key: "1", text: "IT", value: "IT" },
    { key: "2", text: "Hardware", value: "Hardware" },
    { key: "3", text: "Reparacion", value: "Reparacion" },
    { key: "4", text: "Proyectos", value: "Proyectos" },
  ];

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Filtrar Clientes"
          placeholder="Filtrar Clientes"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Form.Field
          control={Select}
          label="Clientes"
          options={optionClients}
          placeholder="Seleccionar Cliente"
          value={formik.values.client}
          onChange={(e, { value }) => formik.setFieldValue("client", value)}
          error={formik.errors.client}
        />
      </Form.Group>
      <Form.Input
        fluid
        label="Titulo"
        name="title"
        placeholder="Titulo"
        onChange={formik.handleChange}
        value={formik.values.title}
        error={formik.errors.title}
      />
      <Form.Group widths="equal">
        <Form.Field
          control={Select}
          label="Prioridad"
          options={options}
          placeholder="Seleccionar Prioridad"
          value={formik.values.priority}
          onChange={(e, { value }) => formik.setFieldValue("priority", value)}
          error={formik.errors.priority}
        />

        <Form.Field
          control={Select}
          label="Sector"
          options={optionsSector}
          placeholder="Seleccionar Sector"
          value={formik.values.department}
          onChange={(e, { value }) => formik.setFieldValue("department", value)}
          error={formik.errors.department}
        />
      </Form.Group>
      {ticketInfo ? (
        <Form.Field
          control={Select}
          label="Estado"
          options={status}
          placeholder="Seleccionar Estado"
          value={formik.values.status}
          onChange={(e, { value }) => formik.setFieldValue("status", value)}
          error={formik.errors.status}
        />
      ) : (
        ""
      )}

      <Form.Group widths="equal">
        <Form.Field
          control={TextArea}
          label="Observaciones"
          name="obs"
          placeholder="Detalle de incidencia"
          value={formik.values.obs}
          onChange={formik.handleChange}
          error={formik.touched.obs && formik.errors.obs}
        />
      </Form.Group>

      <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
        {ticketInfo ? "Actualizar Ticket" : "Crear Ticket"}
      </Form.Button>
    </Form>
  );
}