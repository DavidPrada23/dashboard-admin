import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

interface Venta {
  producto: string;
  monto: number;
  // agrega aquí otros campos si es necesario
}

export default function NotificacionVentas() {
  const [ventaNueva, setVentaNueva] = useState<Venta | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // parsear el email del token
    interface JwtPayload {
      sub: string;
      // agrega aquí otros campos si es necesario
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
