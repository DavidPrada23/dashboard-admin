import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "../../pages/DashboardPage.module.css";

// 🔹 Tipo literal para los filtros disponibles
type Filtro = "hoy" | "ayer" | "ultimos7" | "esteMes" | "mesPasado";

// 🔹 Tipo para los datos del gráfico
interface DataPoint {
  hora?: string;
  dia?: string;
  ventas: number;
}

const SalesChart: React.FC = () => {
  const [filtro, setFiltro] = useState<Filtro>("esteMes");
  const [data, setData] = useState<DataPoint[]>([]);

  // 🔹 Genera datos simulados según el filtro
  const generarDatos = (tipo: Filtro): DataPoint[] => {
    switch (tipo) {
      case "hoy":
        return [
          { hora: "08:00", ventas: 2000 },
          { hora: "10:00", ventas: 3500 },
          { hora: "12:00", ventas: 4800 },
          { hora: "14:00", ventas: 6200 },
          { hora: "16:00", ventas: 7500 },
          { hora: "18:00", ventas: 9100 },
        ];
      case "ayer":
        return [
          { hora: "08:00", ventas: 1800 },
          { hora: "10:00", ventas: 2900 },
          { hora: "12:00", ventas: 4100 },
          { hora: "14:00", ventas: 5800 },
          { hora: "16:00", ventas: 6400 },
          { hora: "18:00", ventas: 7000 },
        ];
      case "ultimos7":
        return [
          { dia: "Lun", ventas: 42000 },
          { dia: "Mar", ventas: 46000 },
          { dia: "Mié", ventas: 39000 },
          { dia: "Jue", ventas: 51000 },
          { dia: "Vie", ventas: 57000 },
          { dia: "Sáb", ventas: 49000 },
          { dia: "Dom", ventas: 53000 },
        ];
      case "mesPasado":
        return [
          { dia: "Semana 1", ventas: 40000 },
          { dia: "Semana 2", ventas: 55000 },
          { dia: "Semana 3", ventas: 48000 },
          { dia: "Semana 4", ventas: 60000 },
        ];
      default: // esteMes
        return [
          { dia: "Semana 1", ventas: 45000 },
          { dia: "Semana 2", ventas: 58000 },
          { dia: "Semana 3", ventas: 62000 },
          { dia: "Semana 4", ventas: 70000 },
        ];
    }
  };

  useEffect(() => {
    setData(generarDatos(filtro));
  }, [filtro]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3>Tendencia de Ventas</h3>

        {/* 🔹 Selector de rango */}
        <div className={styles.filtroContainer}>
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as Filtro)}
            className={styles.filtroSelect}
          >
            <option value="hoy">Hoy</option>
            <option value="ayer">Ayer</option>
            <option value="ultimos7">Últimos 7 días</option>
            <option value="esteMes">Este mes</option>
            <option value="mesPasado">Mes pasado</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey={filtro === "hoy" || filtro === "ayer" ? "hora" : "dia"} stroke="#555" />
          <YAxis stroke="#555" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ventas"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: "#2563eb" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
