import React, { useState, useEffect } from "react";
import {
  Form,
  TextArea,
  Checkbox,
  Radio,
} from "semantic-ui-react";
import { useFormik } from "formik";
import {
  initialValues,
  validationSchema,
} from "./ValidationTicket/validationTicket";
import useAuth from "../../../../../hooks/useAuth";
import { Ticket } from "../../../../../api/ticket";
import { Client } from "../../../../../api/client";
import { Machine } from "../../../../../api/machine"
import "../TicketModal.css";

const ticketController = new Ticket();
const clientController = new Client();
const machineController = new Machine();

const TicketInforme = (props) => {
  const { token } = useAuth();
  const [infoMachine, setInfoMachine] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEquipos, setSelectedEquipos] = useState([]);

  // Estado para almacenar los nombres de las máquinas instaladas
  const [nombresEquipos, setNombresEquipos] = useState([]);
  const { ticketInfo } = props;

  const {
    _id,
    status,
    client,
    diagnostic,
    visit,
    /* trackingId,
    created_at,
    department,
    priority,
    title,
    user,
    obs,
    inventario, */
  } = props.ticketInfo ?? {};

  const handleRadioChange = (_, { value }) => {
    setSelectedOption(value);
  };

  const handleCheckboxChange = (event, { value }) => {
    // Verificar si el equipo ya está seleccionado
    if (selectedEquipos.includes(value)) {
      // Si ya está seleccionado, lo eliminamos de los equipos seleccionados
      setSelectedEquipos(
        selectedEquipos.filter((equipoId) => equipoId !== value)
      );
    } else {
      // Si no está seleccionado, lo agregamos a los equipos seleccionados
      setSelectedEquipos([...selectedEquipos, value]);
    }
  };


// Función para obtener los nombres de las máquinas instaladas
const obtenerNombresEquipos = async () => {
  const nombresTemp = [];

  for (const idMaquina of ticketInfo.inventario) {
    try {
      const data = await machineController.perfilMachine(token, idMaquina);

      if (data.status === "Success" && data.perfil && data.perfil.name) {
        nombresTemp.push(data.perfil.name);
      } else {
        nombresTemp.push("Equipo no encontrado");
      }
    } catch (error) {
      console.log(error);
      nombresTemp.push("Error al obtener el perfil de la máquina");
    }
  }

  setNombresEquipos(nombresTemp);
};


useEffect(() => {
  if (ticketInfo && ticketInfo.inventario && ticketInfo.inventario.length > 0) {
    obtenerNombresEquipos();
  }
}, [ticketInfo]);


  useEffect(() => {
    (async () => {
      try {
        const response = await clientController.listMachines(token, client._id);
        setInfoMachine(response.machines);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validationOnChange: false,
    onSubmit: async (formValue) => {
      try {
        let data = {
          diagnostic: formValue.diagnostic,
          inventario: selectedEquipos,
          status: "Cerrado", // el estado actual del ticket
        };

        const response = await ticketController.updateTicket(token, _id, data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const options = [
    {
      key: "1",
      text: "Mantenimiento Preventivo",
      value: "Mantenimiento Preventivo",
    },
    { key: "2", text: "Inspeccion Mensual", value: "Inspeccion Mensual" },
    { key: "3", text: "Reparacion", value: "Reparacion" },
    { key: "4", text: "Instalacion", value: "Instalacion" },
    { key: "5", text: "Capacitacion", value: "Capacitacion" },
    { key: "6", text: "Otros", value: "Otros" },
  ];

  return (
    <>
      {ticketInfo.status !== "Cerrado" ? (
        <Form onSubmit={formik.handleSubmit}>
          <div className="modal-content">
            <div className="resumen-block">
              <span>Tareas a realizar</span>
              {options.map((option) => (
                <Form.Field key={option.key}>
                  <Radio
                    label={option.text}
                    name="option"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={handleRadioChange}
                  />
                </Form.Field>
              ))}
            </div>

            <div className="resumen-block">
              <span>Equipos Instalados</span>
              {infoMachine !== null &&
                infoMachine.map((equipo) => (
                  <Form.Field key={equipo._id}>
                    <Checkbox
                      label={equipo.name}
                      name="inventario"
                      value={equipo._id} // O cualquier identificador único del equipo
                      checked={selectedEquipos.includes(equipo._id)}
                      onChange={handleCheckboxChange}
                    />
                  </Form.Field>
                ))}
            </div>

            <div className="resumen-block">
              <span>Informe Tecnico</span>
              <Form.Group widths="equal">
                <Form.Field
                  control={TextArea}
                  name="diagnostic"
                  placeholder="Detalle de incidencia"
                  onChange={formik.handleChange}
                  value={formik.values.diagnostic}
                  error={formik.errors.diagnostic}
                />
              </Form.Group>
            </div>
            <div className="resumen-block">
              <span>Horas de trabajo</span>
              <p>2 </p>
            </div>
            <div className="resumen-block">
              <span>Horas de viáticos</span>
              <p>2</p>
            </div>
            <div className="resumen-block">
              <span>Estado de Incidencia</span>
              <p>{status}</p>
            </div>
          </div>
          <Form.Button
            type="submit"
            primary
            fluid
            loading={formik.isSubmitting}
          >
            Cerrar Ticket
          </Form.Button>
        </Form>
      ) : (
        <Form onSubmit={formik.handleSubmit}>
          <div className="modal-content">
            <div className="resumen-block">
              <span>Tarea Realizada</span>
              <div>{visit}</div>
            </div>

            <div className="resumen-block">
              <span>Equipos Intervenidos</span>
              <ul>
          {nombresEquipos.map((nombreEquipo, index) => (
            <li key={index}>{nombreEquipo}</li>
          ))}
        </ul>
            </div>

            <div className="resumen-block">
              <span>Informe Tecnico</span>
              <div>{diagnostic}</div>
            </div>
            <div className="resumen-block">
              <span>Horas de trabajo</span>
              <p>2 </p>
            </div>
            <div className="resumen-block">
              <span>Horas de viáticos</span>
              <p>2</p>
            </div>
            <div className="resumen-block">
              <span>Estado de Incidencia</span>
              <p>{status}</p>
            </div>
          </div>
          <Form.Button
            type="submit"
            primary
            fluid
            loading={formik.isSubmitting}
          >
            Abrir Ticket
          </Form.Button>
        </Form>
      )}
    </>
  );
};

export default TicketInforme;
