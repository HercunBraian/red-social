import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import  Login  from "../components/user/Auth/Login2";
import { LoginLayout } from "../layout/login/LoginLayout";
import { AdminLayout } from "../layout/admin/AdminLayout";
import { ProtectedRoute } from "../components/Global/ProtectedRouter";
import Dashboard from "../scenes/dashboard"
import useAuth from "../hooks/useAuth";

export function PublicRouter() {
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
      <Route path="/" element={
        <ProtectedRoute user={user}>
          {loadLayout(LoginLayout, Login)}
        </ProtectedRoute>} />
    </Routes>

  );
}
