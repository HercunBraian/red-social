import React from "react";
import { useState, useEffect } from "react";
import { Form, TextArea, Select } from "semantic-ui-react";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./equipoValidationForm";
import { Client } from "../../../../api/client";
import useAuth from "../../../../hooks/useAuth";
import { Machine } from "../../../../api/machine";

const machineController = new Machine();
const clientController = new Client();

export function EquipoForm(props) {
    const { token } = useAuth();
    const { onClose, onReload } = props;

    // Input de clientes
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        // Creamos una funcion anonima auto ejecutable
        (async () => {
            try {
                const response = await clientController.list(token);
                setClientes(response.clients.docs)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [token]);

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: validationSchema(),
        validationOnChange: false,
        onSubmit: async (formValue) => {
            try {
                const data = {
                    client: formValue.client,
                    name: formValue.name,
                    serial: formValue.serial,
                    model: formValue.model,
                    version: formValue.version,
                    ubi: formValue.ubi
                }
                console.log(data)
                const response = await machineController.createMachine(token, data);
                console.log(response)
                onReload();
                onClose();
            } catch (error) {
                console.log(error)
            }
        }
    })

    const clientArray = clientesFiltrados.map((client) => client);

    const optionClients = clientArray.map((nombre) => ({
        key: nombre._id,
        text: nombre.name,
        value: nombre.name,
    }));

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group widths='equal'>
                <Form.Input fluid
                    label='Filtrar Clientes'
                    placeholder='Filtrar Clientes'
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <Form.Field
                    control={Select}
                    label='Clientes'
                    options={optionClients}
                    placeholder='Hospital Italiano'
                    value={formik.values.client}
                    onChange={(e, { value }) => formik.setFieldValue('client', value)}
                    error={formik.errors.client}
                />

            </Form.Group>
            <Form.Input fluid
                label='Nombre Maquina'
                name="name"
                placeholder="Nombre"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.errors.name}
            />
            <Form.Group widths="equal">
                <Form.Input fluid
                    label='N° Serie'
                    name="serial"
                    placeholder="N° Serie"
                    onChange={formik.handleChange}
                    value={formik.values.serial}
                    error={formik.errors.serial}
                />
                <Form.Input fluid
                    label='Modelo'
                    name="model"
                    placeholder="Modelo"
                    onChange={formik.handleChange}
                    value={formik.values.model}
                    error={formik.errors.model}
                />
            </Form.Group>
            <Form.Group widths="equal">
            <Form.Input fluid
                    label='Ubicacion'
                    name="ubi"
                    placeholder="Ubicacion"
                    onChange={formik.handleChange}
                    value={formik.values.ubi}
                    error={formik.errors.ubi}
                />
                <Form.Input fluid
                    label='Version Soft'
                    name="version"
                    placeholder="Version"
                    onChange={formik.handleChange}
                    value={formik.values.version}
                    error={formik.errors.version}
                />
            </Form.Group>


            <Form.Button type="submit" primary fluid loading={formik.isSubmitting}>
                Crear Equipo
            </Form.Button>

        </Form>
    )
}