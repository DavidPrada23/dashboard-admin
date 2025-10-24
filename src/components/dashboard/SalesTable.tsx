import { useEffect, useState } from "react";
import axios from "../../api/axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import styles from "./SalesTable.module.css";

interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  monto: number;
  metodoPago: string;
}

type ColumnaOrden = "fecha" | "cliente" | "monto" | "metodoPago";

export default function SalesTable() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [search, setSearch] = useState("");
  const [pagina, setPagina] = useState(1);
  const [ventasPorPagina] = useState(5);
  const [columnaOrden, setColumnaOrden] = useState<ColumnaOrden>("fecha");
  const [ordenAsc, setOrdenAsc] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/ventas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVentas(res.data);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      }
    };
    fetchVentas();
  }, []);

  const ventasFiltradas = ventas.filter(
    (v) =>
      v.cliente.toLowerCase().includes(search.toLowerCase()) ||
      v.metodoPago.toLowerCase().includes(search.toLowerCase())
  );

  const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => {
    let valorA: string | number = a[columnaOrden];
    let valorB: string | number = b[columnaOrden];

    if (columnaOrden === "monto") {
      valorA = Number(valorA);
      valorB = Number(valorB);
    }

    if (columnaOrden === "fecha") {
      valorA = new Date(a.fecha).getTime();
      valorB = new Date(b.fecha).getTime();
    }

    if (valorA < valorB) return ordenAsc ? -1 : 1;
    if (valorA > valorB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const indexUltima = pagina * ventasPorPagina;
  const indexPrimera = indexUltima - ventasPorPagina;
  const ventasPaginadas = ventasOrdenadas.slice(indexPrimera, indexUltima);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  const handleOrdenar = (columna: ColumnaOrden) => {
    if (columnaOrden === columna) {
      setOrdenAsc(!ordenAsc);
    } else {
      setColumnaOrden(columna);
      setOrdenAsc(true);
    }
  };

  const renderOrdenIcono = (columna: ColumnaOrden) => {
    if (columnaOrden !== columna) return "↕️";
    return ordenAsc ? "⬆️" : "⬇️";
  };

  // 📤 Exportar a Excel
  const exportarExcel = () => {
    const hoja = XLSX.utils.json_to_sheet(ventasFiltradas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Ventas");
    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const archivo = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(archivo, "ventas.xlsx");
  };

  // 📄 Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.text("Historial de Ventas", 14, 15);

    doc.autoTable({
        head: [["Fecha", "Cliente", "Monto", "Método de Pago"]],
        body: ventasFiltradas.map((v) => [
            new Date(v.fecha).toLocaleDateString(),
            v.cliente,
            `$${v.monto.toLocaleString()}`,
            v.metodoPago,
        ]),
    startY: 20,
    styles: { fontSize: 9 },
    });

    doc.save("ventas.pdf");
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Historial de Ventas</h3>
        <div className={styles.actions}>
          <input
            type="text"
            placeholder="Buscar por cliente o método..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={exportarExcel} className={styles.exportButton}>
            📊 Excel
          </button>
          <button onClick={exportarPDF} className={styles.exportButton}>
            🧾 PDF
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleOrdenar("fecha")}>
              Fecha {renderOrdenIcono("fecha")}
            </th>
            <th onClick={() => handleOrdenar("cliente")}>
              Cliente {renderOrdenIcono("cliente")}
            </th>
            <th onClick={() => handleOrdenar("monto")}>
              Monto {renderOrdenIcono("monto")}
            </th>
            <th onClick={() => handleOrdenar("metodoPago")}>
              Método de Pago {renderOrdenIcono("metodoPago")}
            </th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.length > 0 ? (
            ventasPaginadas.map((venta) => (
              <tr key={venta.id}>
                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                <td>{venta.cliente}</td>
                <td>${venta.monto.toLocaleString()}</td>
                <td>{venta.metodoPago}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron ventas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
