import { useEffect, useState } from "react";
import axios from "axios";
//import styles from "./DashboardPage.module.css";

import FormularioVenta from "../components/FormularioVenta";
import HistorialVentas from "../components/HistorialVentas";
import LlaveForm from "../components/LlaveForm";
import NotificacionVentas from "../components/NotificacionVentas";

interface Comercio {
  activo: boolean;
  // agrega aquí otras propiedades si las necesitas
}

interface Usuario {
  comercio?: Comercio;
  comercioId?: string;
  // agrega aquí otras propiedades si las necesitas
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  if (loading) return <p>Cargando...</p>;

  if (!usuario?.comercio?.activo) {
    // comercio aún inactivo
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Completa tu configuración</h2>
        <p className="mb-4">Debes registrar tu llave de pago y correo bancario para activar tu comercio.</p>
        <LlaveForm modoRegistroInicial />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel del Comercio</h1>
      <NotificacionVentas />
      <LlaveForm />
      <FormularioVenta />
      <HistorialVentas comercioId={usuario.comercioId ? Number(usuario.comercioId) : 0}/>
    </div>
  );
}
