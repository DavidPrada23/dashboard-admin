import { useState } from 'react';
import axios from 'axios';

import styles from './RegistrarComercioPage.module.css';

export default function RegistrarComercioPage() {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post('http://localhost:8081/api/admin/comercios/registrar', {
        email,
        nombre
      });
      setMensaje('¡Comercio registrado y correo enviado!');
      setEmail('');
      setNombre('');
    } catch {
      setError('Error al registrar el comercio');
    }
  };

  return (
    <div className={styles.registrarContainer}>
      <h2 className={styles.title}>Registrar nuevo comercio</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre del comercio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Registrar
        </button>
      </form>

      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
