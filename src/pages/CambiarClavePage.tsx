import { useState } from 'react';
import axios from 'axios';

export default function CambiarClavePage() {
  const [nuevaClave, setNuevaClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/api/auth/cambiar-clave', {
        nuevaClave,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensaje('Clave actualizada. Ya puedes usar tu nueva contraseña.');
    } catch (err) {
      setError('Error al actualizar la clave');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Cambiar contraseña temporal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          type="password"
          placeholder="Nueva clave"
          value={nuevaClave}
          onChange={(e) => setNuevaClave(e.target.value)}
          required
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          type="submit"
        >
          Actualizar clave
        </button>
      </form>
      {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
