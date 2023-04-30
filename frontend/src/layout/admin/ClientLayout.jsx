import React from "react";
import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import SidebarClient from "../../components/admin/Client/Sidebar";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../../theme";

export function ClientLayout(props) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { children } = props;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content-client">
            <div>

            
            </div>
            <div>
                {children}
            </div>
            
            
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
