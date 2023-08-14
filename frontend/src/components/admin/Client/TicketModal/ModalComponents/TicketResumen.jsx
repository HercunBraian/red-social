import React, { useState } from "react";
import "../TicketModal.css";

const TicketResumen = (props) => {

  const {ticketInfo} = props;
  // Destructurar ticketInfo en variables individuales
  const { trackingId, created_at, department, priority, status, title, client, user, obs, visit } = props.ticketInfo ?? {};
  
  
    // Crear un objeto de fecha a partir de la cadena "created_at"
    const fechaCreacion = new Date(created_at);

    // Obtener la fecha en el formato deseado (por ejemplo, "dd/mm/aaaa")
    const fechaFormateada = fechaCreacion.toLocaleDateString('es-AR'); // Cambia 'es-AR' por tu código de idioma deseado

    
    return (
        <div className="modal-content">
          <div className="resumen-block">
            <span>Cliente</span>
            <div className="resumen-client__name">
            <p>{client?.name ?? 'Nombre del cliente no disponible'}</p>
            </div>
          </div>
          <div className="resumen-block">
            <span>Tecnico Asignado</span>
            <div className="resumen-tecnico__name">
            <p>{user?.name ?? 'Nombre del tecnico no disponible'}</p>
            </div>
          </div>
          <div className="resumen-block">
            <span>Tareas a realizar</span>
            <p>{visit}</p>
          </div>
          <div className="resumen-block">
            <span>Prioridad</span>
            <p>{priority}</p>
          </div>
          <div className="resumen-block">
            <span>Falla indicada por el cliente</span>
            <p>
              {obs}
            </p>
          </div>
          <div className="resumen-block">
            <span>Fecha de la solicitud de Servicio</span>
            <p>{fechaFormateada}</p>
          </div>
        </div>
      );
}

export default TicketResumen