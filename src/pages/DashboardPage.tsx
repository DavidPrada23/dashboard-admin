import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 para redirigir
import styles from "./DashboardPage.module.css";

import FormularioVenta from "../components/FormularioVenta";
import HistorialVentas from "../components/HistorialVentas";
import LlaveForm from "../components/LlaveForm";
import NotificacionVentas from "../components/NotificacionVentas";

interface Comercio {
  activo: boolean;
}

interface Usuario {
  comercio?: Comercio;
  comercioId?: string;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Cargando...</p>;

  if (!usuario?.comercio?.activo) {
    return (
      <div className={styles.container}>
        {/* Header con logo y logout */}
        <div className={styles.headerBar}>
          <img src="/logo.png" alt="Logo PayB" className={styles.logo} />
          <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
        </div>

        <h2 className={styles.header}>Completa tu configuración</h2>
        <p>Debes registrar tu llave de pago y correo bancario para activar tu comercio.</p>
        <div className={styles.card}>
          <LlaveForm modoRegistroInicial />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header con logo y logout */}
      <div className={styles.headerBar}>
        <img src="/payb-logo.png" alt="Logo PayB" className={styles.logo} />
        <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
      </div>

      <h1 className={styles.header}>Panel del Comercio</h1>
      <div className={styles.grid}>
        <div className={styles.card}><NotificacionVentas /></div>
        <div className={styles.card}><LlaveForm /></div>
        <div className={styles.card}><FormularioVenta /></div>
        <div className={styles.card}>
          <HistorialVentas comercioId={usuario.comercioId ? Number(usuario.comercioId) : 0}/>
        </div>
      </div>
    </div>
  );
}
