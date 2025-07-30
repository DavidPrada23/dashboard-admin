import { useState } from "react";
import ComponenteLlave from "../components/ComponenteLlave";
import ComponentePSE from "../components/ComponentePSE";
import ComponenteTarjeta from "../components/ComponenteTarjeta";

export default function CheckoutPage() {
  const [metodoPago, setMetodoPago] = useState<string>("llave");

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Selecciona tu método de pago</h2>

      <select
        value={metodoPago}
        onChange={(e) => setMetodoPago(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="llave">Pago con Llave/QR</option>
        <option value="pse">PSE (Colombia)</option>
        <option value="tarjeta">Tarjeta de Crédito</option>
      </select>

      {metodoPago === "llave" && <ComponenteLlave />}
      {metodoPago === "pse" && <ComponentePSE />}
      {metodoPago === "tarjeta" && <ComponenteTarjeta />}
    </div>
  );
}
