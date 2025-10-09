import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await axios.post("/auth/login", { email, password });

    const { token, claveTemporal, comercioActivo } = res.data;
    localStorage.setItem("token", token);

    if (claveTemporal) {
      navigate("/cambiar-password");
    } else if (!comercioActivo) {
      navigate("/completar-registro");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    console.error(err);
    setError("Credenciales incorrectas");
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/payb-logo.png" alt="PayB" className={styles.logo} />
        <h2 className={styles.title}>Iniciar sesión</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
