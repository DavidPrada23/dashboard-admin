import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function NotificacionVentas() {
  const [ventaNueva, setVentaNueva] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // parsear el email del token
    const parseJwt = (token: string): any => {
      try {
        return JSON.parse(atob(token.split(".")[1]));
      } catch {
        return null;
      }
    };

    const email = parseJwt(token).sub;

    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/ventas/${email}`, (message) => {
          const venta = JSON.parse(message.body);
          setVentaNueva(venta);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  if (!ventaNueva) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg">
      Nueva venta: {ventaNueva.producto} por ${ventaNueva.monto}
    </div>
  );
}
