import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute";
import CambiarClavePage from "./pages/CambiarClavePage";
import CompletarRegistroPage from "./pages/CompletarRegistroPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cambiar-password" element={<CambiarClavePage />} />
        <Route path="/completar-registro" element={<CompletarRegistroPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

