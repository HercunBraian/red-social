import React from "react";
import { useState, useEffect } from "react";
import { Form, TextArea, Select } from "semantic-ui-react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ticketValidationForm";
import { Ticket } from "../../../../api/ticket";
import { Client } from "../../../../api/client";
import { User } from "../../../../api/user";

import useAuth from "../../../../hooks/useAuth";

const ticketController = new Ticket();
const clientController = new Client();
const userController = new User();

export function TicketForm(props) {
  const { token } = useAuth();
  const { onClose, onReload, ticketInfo } = props;

  // Input de clientes
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Input de Tecnicos
  const [tecnicos, setTecnicos] = useState([]);
  const [busquedaTecnico, setBusquedaTecnico] = useState("");
  /* const [busqueda, setBusqueda] = useState(""); */

  useEffect(() => {
    // Creamos una funcion anonima auto ejecutable
    (async () => {
      try {
        const response = await clientController.list(token);
        setClientes(response.clients.docs);

        // Consulta de Tecnicos
        const responseTec = await userController.list(token);
        setTecnicos(responseTec.users);
        console.log(responseTec)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Filtrado de Clientes
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Filtrado de Tecnicos
  const tecnicosFiltrados = tecnicos.filter((tecnico) =>
  tecnico.name.toLowerCase().includes(busquedaTecnico.toLowerCase())
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
          visit: formValue.visit,
          user: formValue.user,
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

  // Array de Clientes
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

  // Array de Tecnicos
  const tecnicosArray = tecnicosFiltrados.map((tecnico) => tecnico);
  console.log(tecnicosArray)
  const optionTecnicos = tecnicosArray.map((nombre) => {
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
    { key: "1", text: "SOPORTE IT", value: "SOPORTE IT" },
    { key: "2", text: "SERVICIO TECNICO", value: "SERVICIO TECNICO" },
  ];

  const optionsVisit = [
    {
      key: "1",
      text: "MANTENIMIENTO PREVENTIVO",
      value: "MANTENIMIENTO PREVENTIVO",
    },
    { key: "2", text: "REPARACION", value: "REPARACION" },
    { key: "3", text: "INSPECCION MENSUAL", value: "INSPECCION MENSUAL" },
    { key: "4", text: "CAPACITACION", value: "CAPACITACION" },
    { key: "5", text: "INSTALACION", value: "INSTALACION" },
    { key: "6", text: "OTROS", value: "OTROS" },
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
      <Form.Field
        control={Select}
        label="Tecnicos"
        options={optionTecnicos}
        placeholder="Seleccionar Tecnico"
        value={formik.values.user}
        onChange={(e, { value }) => formik.setFieldValue("user", value)}
        error={formik.errors.user}
      />
      <Form.Input
        fluid
        label="Titulo"
        name="title"
        placeholder="Titulo"
        onChange={formik.handleChange}
        value={formik.values.title}
        error={formik.errors.title}
      />
      <Form.Field
        control={Select}
        label="Concento de Visita"
        options={optionsVisit}
        placeholder="Concento de Visita"
        value={formik.values.visit}
        onChange={(e, { value }) => formik.setFieldValue("visit", value)}
        error={formik.errors.visit}
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
