import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  getBacktestList,
  getBacktestEquity,
  runBacktest,
  getBacktestRunStatus,
  getBacktestConfig,
  saveBacktestConfig,
  getBacktestEquityAll,
} from "../service/FastService";

const StatCard = ({ label, value, color }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value" style={{ color }}>{value}</div>
  </div>
);

const Backtest = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [equity, setEquity] = useState(null);
  const [equityAll, setEquityAll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runStatus, setRunStatus] = useState({ running: false, last_error: null });
  const [startingRun, setStartingRun] = useState(false);
  const [config, setConfig] = useState({ date_start: "", date_end: "" });
  const [savingConfig, setSavingConfig] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");

  const loadGlobalEquity = async () => {
    try {
      const data = await getBacktestEquityAll();
      setEquityAll(data);
    } catch {
      setEquityAll(null);
    }
  };

  useEffect(() => {
    getBacktestList().then((d) => setList(d.data || []));
    getBacktestRunStatus().then((s) => setRunStatus(s)).catch(() => null);
    getBacktestConfig().then((d) => setConfig(d.data || { date_start: "", date_end: "" })).catch(() => null);
    loadGlobalEquity();
  }, []);

  useEffect(() => {
    if (!runStatus.running) return;
    const id = setInterval(() => {
      getBacktestRunStatus().then((s) => {
        setRunStatus(s);
        if (!s.running) {
          getBacktestList().then((d) => setList(d.data || []));
          loadGlobalEquity();
        }
      }).catch(() => null);
    }, 4000);

    return () => clearInterval(id);
  }, [runStatus.running]);

  const load = async (item) => {
    setSelected(item);
    setLoading(true);
    setEquity(null);
    try {
      const data = await getBacktestEquity(item.symbol, item.mercado, item.algo);
      setEquity(data);
    } catch {
      setEquity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRunBacktest = async () => {
    setStartingRun(true);
    try {
      const response = await runBacktest();
      if (response?.status === "started" || response?.status === "running") {
        const status = await getBacktestRunStatus();
        setRunStatus(status);
      }
    } finally {
      setStartingRun(false);
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      const response = await saveBacktestConfig(config.date_start, config.date_end);
      setConfig(response.data || config);
    } finally {
      setSavingConfig(false);
    }
  };

  const handleSelectBacktest = async (value) => {
    setSelectedKey(value);
    const [symbol, mercado, algo] = value.split("|");
    if (!symbol || !mercado || !algo) return;
    const item = { symbol, mercado, algo };
    await load(item);
  };

  const lineColor = equity?.stats?.total_pips >= 0 ? "#16a34a" : "#dc2626";
  const lineColorAll = equityAll?.stats?.total_pips >= 0 ? "#16a34a" : "#dc2626";

  return (
    <div className="page">
      <h1>Backtest</h1>

      <div className="backtest-actions">
        <button
          onClick={handleRunBacktest}
          className="btn-backtest-run"
          disabled={startingRun || runStatus.running}
        >
          {runStatus.running ? "Backtest en ejecución..." : "Lanzar Backtest"}
        </button>
        {runStatus.last_error && (
          <span className="backtest-run-error">Error: {runStatus.last_error}</span>
        )}
      </div>

      <div className="backtest-config-row">
        <label>
          Fecha inicio:
          <input
            type="date"
            value={config.date_start}
            onChange={(e) => setConfig((prev) => ({ ...prev, date_start: e.target.value }))}
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={config.date_end}
            onChange={(e) => setConfig((prev) => ({ ...prev, date_end: e.target.value }))}
          />
        </label>
        <button onClick={handleSaveConfig} disabled={savingConfig} className="btn-backtest-config">
          {savingConfig ? "Guardando..." : "Guardar periodo"}
        </button>
      </div>

      {equityAll && (
        <>
          <h2 className="backtest-subtitle">Resumen global (all_results.csv)</h2>
          <div className="stat-row">
            <StatCard label="Operaciones" value={equityAll.stats.total_ops} />
            <StatCard
              label="Total Pips"
              value={equityAll.stats.total_pips}
              color={equityAll.stats.total_pips >= 0 ? "#16a34a" : "#dc2626"}
            />
            <StatCard label="Max Drawdown" value={equityAll.stats.max_drawdown} color="#dc2626" />
          </div>
          <div className="backtest-chart">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={equityAll.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => String(v).slice(0, 10)}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} pips`, "Equity global"]} labelFormatter={(l) => `Fecha: ${l}`} />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="equity" stroke={lineColorAll} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── selector ── */}
      <div className="backtest-selector">
        {list.length === 0 && <p style={{ color: "#9ca3af" }}>Sin resultados de backtest disponibles</p>}
        {list.length > 0 && (
          <select
            className="backtest-select"
            value={selectedKey}
            onChange={(e) => handleSelectBacktest(e.target.value)}
          >
            <option value="">Selecciona un algoritmo...</option>
            {list.map((item, i) => {
              const value = `${item.symbol}|${item.mercado}|${item.algo}`;
              return (
                <option key={i} value={value}>
                  {item.symbol} · {item.mercado} · {item.algo}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {loading && <p>Cargando...</p>}

      {equity && (
        <>
          {/* ── stats ── */}
          <div className="stat-row">
            <StatCard label="Operaciones" value={equity.stats.total_ops} />
            <StatCard
              label="Win Rate"
              value={`${equity.stats.win_rate}%`}
              color={equity.stats.win_rate >= 50 ? "#16a34a" : "#dc2626"}
            />
            <StatCard
              label="Total Pips"
              value={equity.stats.total_pips}
              color={equity.stats.total_pips >= 0 ? "#16a34a" : "#dc2626"}
            />
            <StatCard
              label="Max Drawdown"
              value={equity.stats.max_drawdown}
              color="#dc2626"
            />
          </div>

          {/* ── chart ── */}
          <div className="backtest-chart">
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={equity.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => String(v).slice(0, 10)}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v) => [`${v} pips`, "Equity"]}
                  labelFormatter={(l) => `Fecha: ${l}`}
                />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke={lineColor}
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Backtest;
