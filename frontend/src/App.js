import React from "react";
import { AdminRouter, PublicRouter } from "./router";
import 'semantic-ui-css/semantic.min.css'
import "../src/scenes/tickets/ticket.css"

function App() {
  return (
    <>
      <PublicRouter />
      <AdminRouter />
  </>
  );
}

export default App;
