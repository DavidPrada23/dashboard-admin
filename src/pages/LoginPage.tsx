import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './LoginPage.module.css';
import logo from '../assets/payb-logo.png'; // Asegúrate de que la ruta sea correcta

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email: email,
        password: password,
      });

      const { token, claveTemporal } = response.data;
      localStorage.setItem('token', token);

      if (claveTemporal) {
        navigate('/cambiar-clave');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Credenciales inválidas');
    }
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h2 className={styles.title}>Iniciar sesión</h2>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className={styles.input}
            required
          />
          <button
            type="submit"
            className={styles.button}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
