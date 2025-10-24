import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./DashboardPage.module.css";
import paybLogo from "../assets/payb-logo.png";

import DashboardHeader from "../components/DashboardHeader";
import KpiCard from "../components/KpiCard";

import SalesChart from "../components/dashboard/SalesChart";
import SalesTable from "../components/dashboard/SalesTable";

import Loader from "../components/ui/Loader";
import Toast from "../components/ui/Toast";

import { Usuario } from "../types/usuario";
import FormularioVenta from "../components/FormularioVenta";
import LlaveForm from "../components/LlaveForm";
import NotificacionVentas from "../components/NotificacionVentas";

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario>();
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false); // 👈 estado de transición
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsuario = async () => {
    try {
      setActualizando(true); // 👈 activa transición
      const token = localStorage.getItem("token");
      const res = await axios.get("/comercio/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuario(res.data as Usuario);
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

  if (loading) return <Loader text="Cargando tu panel de comercio..." />;

  // Si el comercio aún no está activo
  if (
    !usuario ||
    !usuario.activo ||
    !usuario.llaveActual ||
    !usuario.emailBancario
  ) {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <img src={paybLogo} alt="Logo PayB" className={styles.logo} />
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
      {/* Cabecera profesional */}
      <DashboardHeader
        comercioNombre={usuario?.nombre}
        activo={usuario?.activo}
        onLogout={handleLogout}
      />
      {actualizando ? (
        <p className={styles.transitionText}>Cargando tu panel...</p>
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KpiCard icon="💰" label="Ventas Totales" value="$1.250.000" color="#10b981" />
            <KpiCard icon="🧾" label="Transacciones Hoy" value="48" color="#3b82f6" />
            <KpiCard icon="📈" label="Monto Promedio" value="$26.000" color="#f59e0b" />
            <KpiCard icon="👥" label="Clientes Únicos" value="12" color="#8b5cf6" />
          </div>

          <SalesChart />
          <SalesTable />
          <h1 className={styles.header}>Panel del Comercio</h1>
          <div className={styles.grid}>
            <div className={styles.card}><NotificacionVentas /></div>
            <div className={styles.card}><LlaveForm /></div>
            <div className={styles.card}><FormularioVenta /></div>
          </div>
        </>
      )}
      {/* Feedback visual (Toast) */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
