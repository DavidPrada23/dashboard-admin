import { useState } from "react";
import api from "../api/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CompletarRegistroPage.module.css";

interface LoginResponseDTO {
  token: string;
  claveTemporal: boolean;
  comercioActivo: boolean;
}

export default function CompletarRegistroPage() {
  const [correoBancario, setCorreoBancario] = useState<string>("");
  const [llaveActual, setLlaveActual] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await api.post<LoginResponseDTO>(
        "/auth/completar-registro",
        { correoBancario, llaveActual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // actualizar token si viene
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMensaje("Registro completado correctamente ✅");

      // si comercio ya activo, ir al dashboard
      if (res.data.comercioActivo) {
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        // fallback: refrescar página de completar o mostrar mensaje
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? JSON.stringify(err.response?.data) ?? "Error de servidor");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Completa tu configuración</h2>
        <p>Ingresa tu llave de pago y el correo asociado a tu cuenta bancaria.</p>

        <form onSubmit={handleSubmit}>
          <label>Correo bancario</label>
          <input
            type="email"
            value={correoBancario}
            onChange={(e) => setCorreoBancario(e.target.value)}
            required
            placeholder="ejemplo@banco.com"
          />

          <label>Llave de pago</label>
          <input
            type="text"
            value={llaveActual}
            onChange={(e) => setLlaveActual(e.target.value)}
            required
            placeholder="Ingresa tu llave única"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Completar registro"}
          </button>

          {mensaje && <p className={styles.success}>{mensaje}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
