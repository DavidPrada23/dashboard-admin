import { FormEvent, useState } from "react";
import axios from "../api/axios";

interface LlaveFormProps {
  modoRegistroInicial?: boolean;
  onConfigSaved?: () => void; // 👈 callback opcional para refrescar el usuario
}

export default function LlaveForm({ modoRegistroInicial = false, onConfigSaved }: LlaveFormProps) {
  const [llave, setLlave] = useState("");
  const [emailBancario, setEmailBancario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuardar = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/auth/completar-registro",
        { valor: llave, emailBancario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje("Configuración guardada y comercio activado ✅");
      setLlave("");
      setEmailBancario("");

      // 👇 Llama al callback si fue pasado desde el Dashboard
      if (onConfigSaved) {
        await onConfigSaved();
      }

    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      setMensaje("❌ Error al guardar la configuración.");
    } finally {
      setLoading(false);
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
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Guardando..." : "Guardar configuración"}
      </button>
      {mensaje && <p className="mt-3 text-blue-600 text-center">{mensaje}</p>}
    </form>
  );
}
