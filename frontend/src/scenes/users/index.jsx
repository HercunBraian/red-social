import React, { useState, useEffect } from "react";
import { ENV } from "../../config/config";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { User } from "../../api/user";
import moment from "moment";
import Header from "../../components/Global/Header";

const userController = new User();

const Team = () => {
  const [usersList, setUsersList] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    getList();
  }, []);

  /* useEffect(() => {
    (async () => {
      try {
        const response = await userController.list(token);
        setUsers(response);
        console.log(response.user.docs);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []); */

  const getList = async () => {
    const baseApi = ENV.BASE_API;
    const request = await fetch(`${baseApi}/${ENV.API_ROUTES.UserList}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    if (data.status === "success") {
      setUsersList(data.users);
    }
    console.log(data, usersList);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const getIdUser = (params) => {
    setUserId(params);
    console.log(params);
  };
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClaseName: "name-column--cell",
    },
    {
      field: "surname",
      headerName: "Surname",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Rol",
      flex: 1,
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
                <a href={`profile/${userId}`}>Perfil</a>
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
          rows={usersList || []}
          onRowClick={(rows) => {
            getIdUser(rows.id);
          }}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Team;
