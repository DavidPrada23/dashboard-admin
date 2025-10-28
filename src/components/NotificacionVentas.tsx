import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface Venta {
  producto: string;
  monto: number;
}

export default function NotificacionVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    interface JwtPayload {
      sub: string;
    }

    const parseJwt = (token: string): JwtPayload | null => {
      try {
        return JSON.parse(atob(token.split(".")[1])) as JwtPayload;
      } catch {
        return null;
      }
    };

    const jwtPayload = parseJwt(token);
    if (!jwtPayload) return;
    const email = jwtPayload.sub;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/ventas/${email}`, (message) => {
          const venta = JSON.parse(message.body) as Venta;
          setVentas((prev) => [...prev, venta]);
        });
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient.active) stompClient.deactivate();
    };
  }, []);

  const ultimaVenta = ventas[ventas.length - 1];

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-md min-w-[280px] text-center">
      {ventas.length > 0 ? (
        <div className="text-green-700 font-semibold">
          🛍️ Nueva venta registrada
          <p className="mt-1 text-gray-700">
            <strong>{ultimaVenta.producto}</strong> — ${ultimaVenta.monto.toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic">No se registran ventas</p>
      )}
    </div>
  );
}
