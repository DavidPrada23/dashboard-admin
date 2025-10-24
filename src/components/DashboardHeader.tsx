import styles from "./DashboardHeader.module.css";
import paybLogo from "../assets/payb-logo.png";
interface DashboardHeaderProps {
  comercioNombre: string;
  activo: boolean;
  onLogout: () => void;
}

export default function DashboardHeader({
  comercioNombre,
  activo,
  onLogout,
}: DashboardHeaderProps) {
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
        <button className={styles.settingsButton}>Ajustes</button>
        <button onClick={onLogout} className={styles.logoutButton}>
          Salir
        </button>
      </div>
    </header>
  );
}
