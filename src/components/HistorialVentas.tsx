import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "../api/axios";

type Venta = {
  id: number;
  producto: string;
  monto: number;
  fecha: string;
};

export default function HistorialVentas({ comercioId }: { comercioId: number }) {
  const [ventas, setVentas] = useState<Venta[]>([]);

  const cargarVentas = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("/ventas/mis-ventas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVentas(res.data);
  };

  useEffect(() => {
    cargarVentas();

    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/historial/${comercioId}`, () => {
          // Cuando llegue una notificación, refrescamos
          cargarVentas();
        });
      },
    });
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [comercioId]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Historial de Ventas</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Monto</th>
            <th className="border p-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">{v.producto}</td>
              <td className="border p-2">${v.monto.toFixed(2)}</td>
              <td className="border p-2">{new Date(v.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
