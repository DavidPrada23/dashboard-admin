import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage"; // Asegúrate de que este archivo exista
import PrivateRoute from "./router/PrivateRoute"; // Si no existe aún, puedes omitirlo por ahora
import CambiarClavePage from "./pages/CambiarClavePage";
import RegistrarComercioPage from "./pages/RegistrarComercioPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/cambiar-clave" element={<PrivateRoute><CambiarClavePage /></PrivateRoute>} />
        <Route path="/admin/registrar-comercio" element={<PrivateRoute><RegistrarComercioPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

