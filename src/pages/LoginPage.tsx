import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import styles from './LoginPage.module.css';

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-green-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-green-700 mb-4">PayB</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-800"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-gray-800"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
