import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';

import axios from "../api/axios";

type Llave = {
  id: number;
  valor: string;
  fechaGeneracion: string;
  comercio: {
    id: number;
    nombre: string;
  };
};

export default function ComponenteLlave() {
  const [llave, setLlave] = useState<Llave | null>(null);

  useEffect(() => {
    const comercioId = 1; // ← si gustas esto lo podemos parametrizar
    // obtener la llave actual
    axios
      .get<Llave>(`/llaves/ultima/${comercioId}`)
      .then((res) => {
        setLlave(res.data);
      })
      .catch((err) => {
        console.error("Error obteniendo la llave:", err);
      });

    // suscripción WebSocket
    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(`/topic/llaves/${comercioId}`, (message) => {
          const nuevaLlave = JSON.parse(message.body);
          setLlave(nuevaLlave);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  if (!llave) {
    return <p>Cargando llave de pago...</p>;
  }

  return (
    <div className="p-4 border rounded bg-green-100 space-y-2">
      <h3 className="text-lg font-bold">Llave de pago actual</h3>
      <div className="p-2 bg-white rounded border text-center">{llave.valor}</div>
      ReactDOM.render(
  <QRCodeSVG value="https://reactjs.org/" />,
  document.getElementById('mountNode')
);
      <p className="text-xs text-gray-600">
        Última generación: {new Date(llave.fechaGeneracion).toLocaleString()}
      </p>
    </div>
  );
}
