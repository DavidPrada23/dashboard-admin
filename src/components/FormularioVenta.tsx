import { useState } from "react";
import axios from "../api/axios";  // usa tu axios con configuración de baseURL

export default function FormularioVenta() {
  const [producto, setProducto] = useState("");
  const [monto, setMonto] = useState("");
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [mensaje, setMensaje] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "/ventas",
        { producto, 
          monto: parseFloat(monto),
          cliente,
          metodoPago
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Venta registrada correctamente");
      setProducto("");
      setMonto("");
      setCliente("");
      setMetodoPago("");
    } catch (err) {
      console.error(err);
      alert("Error al registrar la venta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Registrar Venta Manual</h2>
      <input
        type="text"
        placeholder="Producto"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="w-full p-2 border mb-4"
        required
      />
      <input
        type="text"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Selecciona método de pago</option>
        <option value="Nequi">Nequi</option>
        <option value="Bancolombia">Bancolombia</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Bre-b(llave)">Bre-b (llave)</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Registrar</button>
      {mensaje && <p className="text-center text-green-600 mt-2">{mensaje}</p>}
    </form>
  );
}

