import React from "react";
import { Routes, Route, Redirect } from "react-router-dom";

// Componentes
import { Login } from "../components/user/Auth/Login";
import { Register } from "../components/user/Register";
import { ProtectedRoutePrivate } from "../components/ProtectedRouterPrivate";

// Layouts
import { AdminLayout } from "../layout/admin/AdminLayout"
import { LoginLayout } from "../layout/login/LoginLayout";

// Pages
import Clients from "../scenes/Clients";
import Client from "../scenes/Clients/clientsPerfil/index";
import User from "../scenes/users/index";
import Machines from "../scenes/machines/index";
import idMachines from "../scenes/machines/machinesPerfil/index";
import Dashboard from "../scenes/dashboard";
import Ticket from "../scenes/tickets/index"

// Hooks
import useAuth from "../hooks/useAuth";

export function AdminRouter() {

  const {user} = useAuth();
  const loadLayout = (Layout, Page) => {
    return (
      <Layout>
        <Page />
      </Layout>
    )
  }

  return (
    <Routes>
      <Route element={<ProtectedRoutePrivate user={user} />}>
        <Route path="/admin/*" element={loadLayout(AdminLayout, Dashboard)} />
        <Route path="/admin/tickets" element={loadLayout(AdminLayout, Ticket)} />
        <Route path="/admin/clients" element={loadLayout(AdminLayout, Clients)} />
        <Route path="/admin/profile/:clientId" element={loadLayout(AdminLayout, Client)} />
        <Route path="/admin/users" element={loadLayout(AdminLayout, User)} />
        <Route path="/admin/machines" element={loadLayout(AdminLayout, Machines)} />
        <Route path="/machine-profile/:machineId" element={loadLayout(AdminLayout, idMachines)} />
      </Route>
    </Routes>
  );
}
