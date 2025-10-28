import { FormEvent, useState, useEffect } from "react";
import axios from "../api/axios";

interface LlaveFormProps {
  modoRegistroInicial?: boolean;
  onConfigSaved?: () => void; // 👈 callback opcional para refrescar el usuario
}

export default function LlaveForm({ modoRegistroInicial = false, onConfigSaved }: LlaveFormProps) {
  const [llave, setLlave] = useState("");
  const [llaveVisible, setLlaveVisible] = useState(false);
  const [emailBancario, setEmailBancario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLlaveActual = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/llaves/ultima", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.valor) {
          setLlave(response.data.valor);
        }
      } catch (error) {
        console.error("Error al obtener la llave:", error);
      }
    };

    fetchLlaveActual();
  }, []);

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
  const toggleVisibilidad = () => {
    setLlaveVisible((prev) => !prev);
  };

  // 👁️ Mostrar la llave parcialmente cuando no está visible
  const llaveMostrada = llaveVisible
    ? llave
    : llave
    ? `${llave.slice(0, 6)}••••••${llave.slice(-4)}`
    : "";

  return (
    <form
      onSubmit={handleGuardar}
      className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 transition-all hover:shadow-lg"
    >
      <label className="block mb-2 font-semibold text-gray-700">Llave de pago</label>
      <div className="relative mb-4">
        <input
          type={llaveVisible ? "text" : "password"}
          value={llaveMostrada}
          onChange={(e) => setLlave(e.target.value)}
          className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={toggleVisibilidad}
          className="absolute right-2 top-2 text-sm text-gray-500 hover:text-gray-800"
        >
          {llaveVisible ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {modoRegistroInicial && (
        <>
          <label className="block mb-2 font-semibold text-gray-700">
            Correo bancario asociado
          </label>
          <input
            type="email"
            value={emailBancario}
            onChange={(e) => setEmailBancario(e.target.value)}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Guardando..." : "Guardar configuración"}
      </button>

      {mensaje && (
        <p
          className={`mt-3 text-center text-sm font-medium ${
            mensaje.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}
