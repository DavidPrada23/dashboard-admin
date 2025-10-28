import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import styles from "./CrearUsuarioForm.module.css";

interface CrearUsuarioFormProps {
  token: string; // JWT del admin
}

interface RegistroRequestDTO {
  email: string;
  password: string;
  comercioId: number;
  rol: "COMERCIO" | "ADMIN" | "SUPERADMIN";
}

interface ApiResponse {
  message: string;
}

const CrearUsuarioForm: React.FC<CrearUsuarioFormProps> = ({ token }) => {
  const [formData, setFormData] = useState<RegistroRequestDTO>({
    email: "",
    password: "",
    comercioId: 0,
    rol: "COMERCIO",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "comercioId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/auth/registrar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message || "Usuario creado correctamente");
      setFormData({
        email: "",
        password: "",
        comercioId: 0,
        rol: "COMERCIO",
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message ||
          "Ocurrió un error al crear el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Crear nuevo usuario</h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={styles.input}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className={styles.label} htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={styles.input}
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label className={styles.label} htmlFor="comercioId">
          ID del comercio
        </label>
        <input
          id="comercioId"
          name="comercioId"
          type="number"
          className={styles.input}
          value={formData.comercioId}
          onChange={handleChange}
          required
        />

        <label className={styles.label} htmlFor="rol">
          Rol
        </label>
        <select
          id="rol"
          name="rol"
          className={styles.select}
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="COMERCIO">Comercio</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Creando usuario..." : "Registrar usuario"}
        </button>
      </form>

      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default CrearUsuarioForm;
