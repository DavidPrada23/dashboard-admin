import styles from "./DashboardHeader.module.css";
import { useState } from "react";
import paybLogo from "../assets/payb-logo.png";

import LlaveForm from "./LlaveForm";
import FormularioVenta from "./FormularioVenta";
interface DashboardHeaderProps {
  comercioNombre: string;
  activo: boolean;
  onLogout: () => void;
  userRole?: string | null;
}

export default function DashboardHeader({
  comercioNombre,
  activo,
  onLogout,
  userRole = "USER",
}: DashboardHeaderProps) {
  const [showConfig, setShowConfig] = useState(false);
  return (
    <header className={styles.headerBar}>
      {/* Logo + nombre */}
      <div className={styles.leftSection}>
        <img src={paybLogo} alt="Logo PayB" className={styles.logo} />
        <div className={styles.comercioInfo}>
          <h1 className={styles.welcomeText}>
            Bienvenido, <span>{comercioNombre}</span>
          </h1>
          <span
            className={`${styles.estado} ${
              activo ? styles.activo : styles.inactivo
            }`}
          >
            {activo ? "🟢 Comercio Activo" : "🔴 Inactivo"}
          </span>
        </div>
      </div>

      {/* Botones */}
      <div className={styles.rightSection}>
        <button onClick={() => setShowConfig(true)}
        >
          ⚙️ Ajustes
        </button>
        {/* Modal personalizado */}
        {showConfig && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button
                className={styles.closeButton}
                onClick={() => setShowConfig(false)}
              >
                ✕
              </button>
              <h2 className={styles.modalTitle}>Configuración del Comercio</h2>

              {userRole === "ADMIN" ? (
                <div className={styles.modalContent}>
                  <LlaveForm />
                  <FormularioVenta />
                </div>
              ) : (
                <p className={styles.noPermission}>
                  No tienes permiso para acceder a esta sección.
                </p>
              )}
            </div>
          </div>
        )}
        <button onClick={onLogout} className={styles.logoutButton}>
          Salir
        </button>
      </div>
    </header>
  );
}
