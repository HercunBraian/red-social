import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@material-ui/core';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

// Importacion Hooks
import useAuth from '../../../../hooks/useAuth';

// Importaciones para peticion a Api y Validacion de Form
import { Client } from "../../../../api/client";
import { initialValues, validationSchema } from "./registerForm";
import { useFormik } from "formik";

const clientController = new Client();

function ClientRegister(props) {
  const { onReload } = props;
  const {token} = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validationOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const response = await clientController.createClient(token, formValue);
        onReload();
        handleClose();
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Nuevo Cliente
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Container maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Nombre Cliente"
                  name="name"
                  autoComplete="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="phone"
                  label="N° Celular"
                  name="phone"
                  autoComplete="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="direccion"
                  label="Dirección Address"
                  name="direccion"
                  autoComplete="direccion"
                  onChange={formik.handleChange}
                  value={formik.values.direccion}
                  error={formik.touched.direccion && Boolean(formik.errors.direccion)}
                  helperText={formik.touched.direccion && formik.errors.direccion}
                  autoFocus
                />

                <Box textAlign='center' sx={{ mt: 3, mb: 2 }}>
                  <Button type="submit" color="primary" variant='contained'>
                    Crear Cliente
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default ClientRegister;

