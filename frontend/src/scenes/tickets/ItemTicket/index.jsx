import React, { useState, useEffect, createRef } from "react";
import { Box } from "@mui/material";
import { ENV } from "../../../config/config";
import { useParams } from "react-router-dom";
import { Form, TextArea } from "semantic-ui-react";
import { Ticket } from "../../../api/ticket";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./ticketUpdateValidation";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../assets/logo.jpg";
import "../ticket.css";

// Importaciones de Exportacion de PDF
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ticketController = new Ticket();

const ClientDetailContainer = () => {
  const { token } = useAuth();

  // useState Tickets
  const [infoTicket, setInfoTicket] = useState({});

  const { ticketId } = useParams();

  useEffect(() => {
    const getTicket = async () => {
      const baseApi = ENV.BASE_API;
      const request = await fetch(
        `${baseApi}/${ENV.API_ROUTES.TicketPerfil}/${ticketId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await request.json();
      if (data.status === "success") {
        setInfoTicket(data.ticket);
      }
      console.log(data);
    };
    getTicket();
  }, [infoTicket._id]);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validationOnChange: false,
    onSubmit: async (formValue) => {
      try {
        let data = {
          diagnostic: formValue.diagnostic,
          status: infoTicket.status, // el estado actual del ticket
        };
        if (infoTicket.status === "Cerrado") {
          // si el estado es "Cerrado"
          data.status = "En Proceso"; // actualiza el estado a "En Proceso"
        }
        if (infoTicket.status === "En Proceso" || "Pendiente") {
          // si el estado es "En Proceso o Pendiente"
          data.status = "Cerrado"; // actualiza el estado a "Cerrado"
        }

        const response = await ticketController.updateTicket(
          token,
          infoTicket._id,
          data
        );
        setInfoTicket(response);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Exportacion
  const exportPdf = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(
      input,
      { scale: 0.9, width: 1200, dpi: window.devicePixelRatio * 3000, letterRendering: 5 }
      // Ajusta el ancho del canvas aquí
    ).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("download.pdf");
    });
  };

  const hiddenRef = createRef();
  
  function handleEmailClick() {
    const to = 'destinatario@example.com';
    const subject = `N° Seguimiento Ticket: ${infoTicket.trackingId}`;
    const body = `Estimados, abrimos un ticket con la siguiente informacion: 

Asunto: ${infoTicket.title},
Cliente: ${infoTicket.client && infoTicket.client.name},
Tecnico: ${infoTicket.user && infoTicket.user.name},
Incidencia: ${infoTicket.obs}`;
    
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  }


  return (
    <>
      <Box m="20px" sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            width: "80%",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginLeft: "80px",
            }}
          >
            <Box
              sx={{
                width: "60%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 1,
              }}
            >
              <img src={logo} className="logo" alt="Logo de mi aplicación" />
              <p className="logo-p">Office 149, 450 South Brand Brooklyn</p>
              <p className="logo-p">San Diego County, CA 91905, USA</p>
              <p className="logo-p">+1 (123) 456 7891, +44 (876) 543 2198</p>
            </Box>
            <Box
              sx={{
                width: "60%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 1,
              }}
            >
              <h2>Ticket: #{infoTicket.trackingId}</h2>
              <p className="logo-p">
                Fecha Creacion: <b>25/05/23</b>
              </p>
              <p className="logo-p">
                Fecha Cierre: <b>25/05/23</b>
              </p>
            </Box>
          </Box>
          <hr></hr>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: "80px",
            }}
          >
            <Box
              sx={{
                width: "60%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 1,
              }}
            >
              <h3>
                Cliente: <b>{infoTicket.client && infoTicket.client.name}</b>
              </h3>
              <p className="logo-p">
                Direccion: <b>Av Presidente Peron 1500</b>
              </p>
              <p className="logo-p">
                Email: <b>ramos@trinidad.com.ar</b>
              </p>
              <p className="logo-p">
                Telefono: <b>1533353228</b>
              </p>
            </Box>
            <Box
              sx={{
                width: "60%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 1,
              }}
            >
              <h3>
                Asunto: <b>{infoTicket.title}</b>
              </h3>
              <p className="logo-p">
                Tecnico: <b>{infoTicket.user && infoTicket.user.name}</b>
              </p>
              <p className="logo-p">
                Sector: <b>{infoTicket.department}</b>
              </p>
              <p className="logo-p">
                Pioridad: <b>{infoTicket.priority}</b>
              </p>
              <p className="logo-p">
                Fecha Creacion: <b>{infoTicket.created_at}</b>
              </p>
            </Box>
          </Box>

          <hr></hr>

          <Box
            sx={{
              width: "80%",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 1,
              marginLeft: "80px",
            }}
          >
            <h3>Detalle Incidencia:</h3>
            <p className="logo-p">
              <b>{infoTicket.obs}</b>
            </p>
            <hr></hr>
            <h3>Trabajo Realizado:</h3>
            <p className="logo-p">
              <b>{infoTicket.diagnostic}</b>
            </p>

            {infoTicket.status !== "Cerrado" ? (
              <Form onSubmit={formik.handleSubmit}>
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
                <Form.Button
                  type="submit"
                  primary
                  fluid
                  loading={formik.isSubmitting}
                  onClick={() => {
                    const data = { status: "En Proceso" };
                    ticketController.updateTicket(token, infoTicket._id, data);
                  }}
                >
                  Abrir Ticket
                </Form.Button>
              </Form>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            width: "18%",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 1,
            height: "auto",
          }}
        >
          <div className="button-ticket" onClick={handleEmailClick}>Enviar Ticket</div>
          <div className="button-ticket" onClick={exportPdf}>
            Descargar
          </div>
        </Box>
      </Box>

      <div ref={hiddenRef} style={{ position: "absolute", left: "-9999px", top: "-9999px" }} id="pdf-content">
        <Box m="20px" sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              width: "80%",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "80px",
              }}
            >
              <Box
                sx={{
                  width: "60%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <img src={logo} className="logo" alt="Logo de mi aplicación" />
                <p className="logo-p">Office 149, 450 South Brand Brooklyn</p>
                <p className="logo-p">San Diego County, CA 91905, USA</p>
                <p className="logo-p">+1 (123) 456 7891, +44 (876) 543 2198</p>
              </Box>
              <Box
                sx={{
                  width: "60%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <h2>Ticket: #{infoTicket.trackingId}</h2>
                <p className="logo-p">
                  Fecha Creacion: <b>25/05/23</b>
                </p>
                <p className="logo-p">
                  Fecha Cierre: <b>25/05/23</b>
                </p>
              </Box>
            </Box>
            <hr></hr>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginLeft: "80px",
              }}
            >
              <Box
                sx={{
                  width: "60%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <h3>
                  Cliente: <b>{infoTicket.client && infoTicket.client.name}</b>
                </h3>
                <p className="logo-p">
                  Direccion: <b>Av Presidente Peron 1500</b>
                </p>
                <p className="logo-p">
                  Email: <b>ramos@trinidad.com.ar</b>
                </p>
                <p className="logo-p">
                  Telefono: <b>1533353228</b>
                </p>
              </Box>
              <Box
                sx={{
                  width: "60%",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <h3>
                  Asunto: <b>{infoTicket.title}</b>
                </h3>
                <p className="logo-p">
                  Tecnico: <b>{infoTicket.user && infoTicket.user.name}</b>
                </p>
                <p className="logo-p">
                  Sector: <b>{infoTicket.department}</b>
                </p>
                <p className="logo-p">
                  Pioridad: <b>{infoTicket.priority}</b>
                </p>
                <p className="logo-p">
                  Fecha Creacion: <b>{infoTicket.created_at}</b>
                </p>
              </Box>
            </Box>

            <hr></hr>

            <Box
              sx={{
                width: "80%",
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 1,
                marginLeft: "80px",
              }}
            >
              <h3>Detalle Incidencia:</h3>
              <p className="logo-p">
                <b>{infoTicket.obs}</b>
              </p>
              <hr></hr>
              <h3>Trabajo Realizado:</h3>
              <p className="logo-p">
                <b>{infoTicket.diagnostic}</b>
              </p>
            </Box>
          </Box>

          <Box
            sx={{
              width: "18%",
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 1,
              height: "auto",
            }}
          >
            <div className="button-ticket">Enviar Ticket</div>
            <div className="button-ticket" onClick={exportPdf}>
              Descargar
            </div>
            <div className="button-ticket">Imprimir</div>
            <div className="button-ticket">Editar</div>
          </Box>
        </Box>
        
      </div>
    </>
  );
};

export default ClientDetailContainer;
