import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";

import { Usuario } from "../types/Usuario";
import FormularioVenta from "../components/FormularioVenta";
import HistorialVentas from "../components/HistorialVentas";
import LlaveForm from "../components/LlaveForm";
import NotificacionVentas from "../components/NotificacionVentas";

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false); // 👈 NUEVO estado
  const navigate = useNavigate();

  const fetchUsuario = async () => {
    try {
      setActualizando(true); // 👈 activa transición
      const token = localStorage.getItem("token");
      const res = await axios.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setActualizando(false), 1000); // 👈 da tiempo para animación
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className={styles.loading}>Cargando dashboard...</p>;

  // Si el comercio aún no está activo
  if (
    !usuario?.comercio ||
    !usuario.comercio.activo ||
    !usuario.comercio.llave_actual ||
    !usuario.comercio.email_bancario
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <img src="/logo.png" alt="Logo PayB" className={styles.logo} />
          <button onClick={handleLogout} className={styles.logoutButton}>Salir</button>
        </div>

        <h2 className={styles.header}>Completa tu configuración</h2>
        <p>Registra tu llave de pago y correo bancario para activar tu comercio.</p>
        <div className={styles.card}>
          <LlaveForm modoRegistroInicial onConfigSaved={fetchUsuario} />
        </div>

        {actualizando && <p className={styles.transitionText}>Actualizando tu panel...</p>}
      </div>
    );
  }

  // Dashboard principal
  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <img src="/payb-logo.png" alt="Logo PayB" className={styles.logo} />
        <button onClick={handleLogout} className={styles.logoutButton}>
          Salir
        </button>
      </div>

      {actualizando ? (
        <p className={styles.transitionText}>Cargando tu panel...</p>
      ) : (
        <>
          <h1 className={styles.header}>Panel del Comercio</h1>
          <div className={styles.grid}>
            <div className={styles.card}><NotificacionVentas /></div>
            <div className={styles.card}><LlaveForm /></div>
            <div className={styles.card}><FormularioVenta /></div>
            <div className={styles.card}>
              <HistorialVentas comercioId={usuario.comercioId ? Number(usuario.comercioId) : 0} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
