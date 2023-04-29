import React, { useState, useEffect } from "react";
import { ENV } from "../../config/config";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Machine } from "../../api/machine";
import moment from "moment";
import Header from "../../components/Global/Header";
import { EquipoForm } from "../../components/admin/Equipo/EquipoForm/EquipoForm";
import useAuth from "../../hooks/useAuth";

// Importaciones de Semantic-UI
import { Button } from "semantic-ui-react"
import { BasicModal } from "../../components/admin/Shared/BasicModal/BasicModal"

const machineController = new Machine();

const Machines = () => {
    const { token } = useAuth();
    const [machineList, setMachineList] = useState(null);
    const [machineId, setMachineId] = useState(null);

    // Show Modal
    const [showModal, setShowModal] = useState(false)
    const [reload, setReload] = useState(false);

    //Funcion para abrir o cerrar el modal
    const onOpenCloseModal = () => setShowModal ((prevState) => !prevState);

    const onReload = () => setReload((prevState) => !prevState);

    useEffect(() => {
        getList();
    }, [reload]);

    const getList = async () => {
        const baseApi = ENV.BASE_API;
        const request = await fetch(`${baseApi}/${ENV.API_ROUTES.MachineList}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });

        const data = await request.json();

        console.log(data);
        if (data.status === "success") {
            setMachineList(data.machines);
        }
    };

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const getIdMachine = (params) => {
        setMachineId(params);
    };
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClaseName: "name-column--cell",
        },
        {
            field: "serial",
            headerName: "N° Serie",
            flex: 1,
        },
        {
            field: "model",
            headerName: "Modelo",
            flex: 1,
        },
        {
            field: "ubi",
            headerName: "Ubicacion",
            flex: 1,
        },
        {
            field: "client",
            headerName: "Client",
            flex: 1,
            valueGetter: (params) => params.row.client.name
        },
        {
            field: "created_at",
            headerName: "Fecha Creacion",
            flex: 1,
            renderCell: (params) =>
                moment(params.row.created_at).format("DD-MM-YYYY HH:MM:SS"),
        },
        {
            field: "access",
            headerName: "Acciones",
            flex: 1,
            renderCell: () => {
                return (
                    <>
                        <Box
                            width="60%"
                            m="0 auto"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            backgroundColor={colors.greenAccent[700]}
                            borderRadius="4px"
                        >
                            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                                <a href={`/machine-profile/${machineId}`}>Perfil</a>
                            </Typography>
                        </Box>
                        <Box
                            width="60%"
                            m="0 auto"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            borderRadius="4px"
                            sx={{ ml: "5px" }}
                            backgroundColor={colors.greenAccent[700]}
                        >
                            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                                Editar
                            </Typography>
                        </Box>
                        <Box
                            width="60%"
                            m="0 auto"
                            p="5px"
                            display="flex"
                            justifyContent="center"
                            borderRadius="4px"
                            backgroundColor={colors.greenAccent[700]}
                            sx={{ ml: "5px" }}
                        >
                            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                                Eliminar
                            </Typography>
                        </Box>
                    </>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Header title="TEAM" subtitle="Managing the Team Members" />

            <div className="menu-page">
                <Button className="menu-page__add" primary onClick={onOpenCloseModal}>
                    Nuevo Equipo
                </Button>
            </div>

            <BasicModal show={showModal} close={onOpenCloseModal} title="Crear Nuevo Equipo">
                <EquipoForm onReload={onReload} onClose={onOpenCloseModal} />
            </BasicModal>

            <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-row": {
            borderBottom: colors.blueAccent[700],
          },
          "& .MuiDataGrid-cellContent": {
            fontSize: "15px",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={machineList || []}
                    onRowClick={(rows) => {
                        getIdMachine(rows.id);
                    }}
                    columns={columns}
                />
            </Box>
        </Box>
    );
};

export default Machines;
