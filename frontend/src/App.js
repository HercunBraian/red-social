import React from "react";
import { AdminRouter, PublicRouter } from "./router";

function App() {
  return (
    <>
      <PublicRouter />
      <AdminRouter />
  </>
  );
}

export default App;
