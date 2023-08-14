import React, { useState, useEffect } from "react";
import { Button, Modal } from "semantic-ui-react";
import "./TicketModal.css";

import {Ticket} from "../../../../api/ticket";
import useAuth from "../../../../hooks/useAuth";

// Importacion Componentes
import TicketInforme from "./ModalComponents/TicketInforme";
import TicketResumen from "./ModalComponents/TicketResumen";

const ticketController = new Ticket();

const TicketModal = ({ idTicket, closeModal }) => {

  const [open, setOpen] = useState(true); // Abre el modal directamente
  const [ticket, setTicket] = useState(null);
  const { token } = useAuth();
  const [activeComponent, setActiveComponent] = useState("component1");

  const handleCloseModal = () => {
    setOpen(false);
    setActiveComponent(null);
    closeModal(); // Cierra el modal en ListTickets
  };

  const handleComponentButtonClick = (component) => {
    setActiveComponent(component);
  };


  useEffect(() => {
    (async () => {
      try {
        setTicket(null);
        const response = await ticketController.getTicket(
          token,
          idTicket
        );
        setTicket(response.ticket);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const renderComponent = () => {
    if (activeComponent === "component1") {
      return <TicketResumen ticketInfo={ticket} />
    } else if (activeComponent === "component2") {
      return <TicketInforme ticketInfo={ticket} />
    }

    return null;
  };
  
  return (
    <div>
      <Modal open={open} onClose={handleCloseModal}>
        <Modal.Header className="modal-header">
          <div className="modal-header__title">
            <div>{ticket ? ticket.department : ""}</div>
            <p>#{ticket ? ticket.trackingId : ""}</p>
          </div>
        </Modal.Header>
        <Modal.Content>
          <div className="modal-content__button">
            <Button
              onClick={() => handleComponentButtonClick("component1")}
              className={
                activeComponent === "component1" ? "active-button" : ""
              }
            >
              Resumen
            </Button>
            <Button
              onClick={() => handleComponentButtonClick("component2")}
              className={
                activeComponent === "component2" ? "active-button" : ""
              }
            >
              Informe
            </Button>
          </div>

          {renderComponent()}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default TicketModal;
