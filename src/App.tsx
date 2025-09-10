import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./router/PrivateRoute"; 
import CambiarClavePage from "./pages/CambiarClavePage";
import RegistrarComercioPage from "./pages/RegistrarComercioPage";
import LlaveForm from "./components/LlaveForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Flujo especial */}
        <Route path="/cambiar-clave" element={<PrivateRoute><CambiarClavePage /></PrivateRoute>} />
        <Route path="/completar-datos" element={<PrivateRoute><LlaveForm /></PrivateRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />

        <Route path="/admin/registrar-comercio" element={<PrivateRoute><RegistrarComercioPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

