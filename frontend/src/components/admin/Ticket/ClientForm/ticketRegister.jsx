import { useState, useEffect } from "react";
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
import { Ticket } from "../../../../api/ticket";
import { Client } from "../../../../api/client"
import { initialValues, validationSchema } from "./registerForm";
import { useFormik } from "formik";

const ticketController = new Ticket();
const clientController = new Client();

function TicketRegister() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);

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
  }, []);

  console.log("clientes", clientes)
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.name.toLowerCase().includes(busqueda.toLowerCase())
  );

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
        const response = await ticketController.createTicket(token, formValue);
        handleClose();
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Nuevo Ticket
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
                  id="client"
                  label="Nombre Cliente"
                  name="client"
                  autoComplete="client"
                  onChange={formik.handleChange}
                  value={formik.values.client}
                  error={formik.touched.client && Boolean(formik.errors.client)}
                  helperText={formik.touched.client && formik.errors.client}
                  autoFocus
                />
                <TextField id="outlined-search" value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)} label="Buscar Cliente" type="search" />


                <TextField
                  id="outlined-select-currency"
                  select
                  margin="normal"
                  required
                  fullWidth
                  label="Seleccionar Cliente"
                >
                  {clientesFiltrados.map(cliente => (
                    <option key={cliente.name} value={cliente.name}>
                      {cliente.name}
                    </option>
                  ))}
                </TextField>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Asunto"
                  name="title"
                  autoComplete="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="obs"
                  label="Observaciones"
                  name="obs"
                  autoComplete="obs"
                  onChange={formik.handleChange}
                  value={formik.values.obs}
                  error={formik.touched.obs && Boolean(formik.errors.obs)}
                  helperText={formik.touched.obs && formik.errors.obs}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="priority"
                  label="Nivel Prioridad"
                  name="priority"
                  autoComplete="priority"
                  onChange={formik.handleChange}
                  value={formik.values.priority}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                  helperText={formik.touched.priority && formik.errors.priority}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="department"
                  label="Sector"
                  name="department"
                  autoComplete="department"
                  onChange={formik.handleChange}
                  value={formik.values.department}
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                  autoFocus
                />

                <Box textAlign='center' sx={{ mt: 3, mb: 2 }}>
                  <Button type="submit" color="primary" variant='contained'>
                    Crear Ticket
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

export default TicketRegister;

