import { useEffect, useState } from "react";
import { getNodes } from "../service/FastService";

const fmt = (v) => (v == null ? "—" : Number(v).toFixed(2));

const Nodes = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 50;
  const [filters, setFilters] = useState({
    principal_symbol: "",
    symbol_cruce: "",
    mercado: "",
    label: "",
  });

  const fetchNodes = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      params.page = currentPage;
      const data = await getNodes(params);
      setNodes(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setNodes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes(page);
  }, []);

  const set = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleSearch = () => {
    setPage(1);
    fetchNodes(1);
  };

  const handlePage = (newPage) => {
    setPage(newPage);
    fetchNodes(newPage);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="page">
      <h1>Nodes</h1>

      {/* ── filtros ── */}
      <div className="nodes-filters">
        <input
          placeholder="Symbol (ej: EURUSD)"
          value={filters.principal_symbol}
          onChange={(e) => set("principal_symbol", e.target.value)}
        />
        <input
          placeholder="Cruce (ej: GBPUSD)"
          value={filters.symbol_cruce}
          onChange={(e) => set("symbol_cruce", e.target.value)}
        />
        <select value={filters.mercado} onChange={(e) => set("mercado", e.target.value)}>
          <option value="">Todos los mercados</option>
          <option>Asia</option>
          <option>Europa</option>
          <option>America</option>
        </select>
        <select value={filters.label} onChange={(e) => set("label", e.target.value)}>
          <option value="">UP + DOWN</option>
          <option>UP</option>
          <option>DOWN</option>
        </select>
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {loading && <p>Cargando...</p>}

      {/* ── tabla ── */}
      {!loading && (
        <>
          <div className="nodes-table-wrap">
            <table className="nodes-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Cruce</th>
                  <th>Mercado</th>
                  <th>Label</th>
                  <th>successful_operations</th>
                  <th>current_porcentage</th>
                  <th>successful_operations_os</th>
                  <th>current_porcentage_os</th>
                  <th>expectancy</th>
                  <th>expectancy_os</th>
                </tr>
              </thead>
              <tbody>
                {nodes.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", color: "#9ca3af" }}>
                      Sin resultados
                    </td>
                  </tr>
                )}
                {nodes.map((n) => (
                  <tr key={n.id}>
                    <td>{n.principal_symbol}</td>
                    <td>{n.symbol_cruce}</td>
                    <td>{n.mercado}</td>
                    <td>
                      <span className={`label-badge ${n.label === "UP" ? "badge-up" : "badge-down"}`}>
                        {n.label}
                      </span>
                    </td>
                    <td>{n.successful_operations}</td>
                    <td>{fmt(n.correct_percentage)}%</td>
                    <td>{n.successful_operations_os}</td>
                    <td>{fmt(n.correct_percentage_os)}%</td>
                    <td>{fmt(n.expectancy)}</td>
                    <td>{fmt(n.expectancy_os)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── paginación ── */}
          <div className="nodes-pagination">
            <button onClick={() => handlePage(page - 1)} disabled={page <= 1}>
              ‹ Anterior
            </button>
            <span>
              Página {page} de {totalPages || 1} &nbsp;·&nbsp; {total} registros
            </span>
            <button onClick={() => handlePage(page + 1)} disabled={page >= totalPages}>
              Siguiente ›
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Nodes;
