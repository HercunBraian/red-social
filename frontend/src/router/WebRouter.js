import React from "react";
import { Routes, Route } from "react-router-dom";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import PublicLayout from "../scenes/public/PublicLayout";

export function WebRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />} />
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
    </Routes>
  );
}
