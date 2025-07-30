import { FormEvent, useState } from "react";
import axios from "axios";

export default function LlaveForm({ modoRegistroInicial = false }: { modoRegistroInicial?: boolean }) {
  const [llave, setLlave] = useState("");
  const [emailBancario, setEmailBancario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/llaves",
        { valor: llave, emailBancario },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Configuración guardada y comercio activado.");
    } catch (err) {
      setMensaje("Error al guardar la configuración.");
    }
  };

  return (
    <form onSubmit={handleGuardar} className="bg-white p-4 rounded shadow">
      <label className="block mb-2 font-semibold">Llave de pago</label>
      <input
        type="text"
        value={llave}
        onChange={(e) => setLlave(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      {modoRegistroInicial && (
        <>
          <label className="block mb-2 font-semibold">Correo asociado a tu cuenta bancaria</label>
          <input
            type="email"
            value={emailBancario}
            onChange={(e) => setEmailBancario(e.target.value)}
            className="w-full p-2 border mb-4"
            required
          />
        </>
      )}
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
      {mensaje && <p className="mt-2 text-blue-500">{mensaje}</p>}
    </form>
  );
}
