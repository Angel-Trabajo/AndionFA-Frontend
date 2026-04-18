import { useEffect, useRef, useState } from "react";
import {
  startEngine,
  stopEngine,
  getEngineStatus,
  getLiveConfig,
  saveLiveConfig,
  applyLiveFilter,
  updateEngineLotSize,
  stopSingleEngine,
} from "../service/FastService";
import { useEngineSocket } from "../hooks/useEngineSocket";

const DEFAULT_FILTERS = {
  winrate: 0.45,
  profit_factor: 1.2,
  expectancy: 1.5,
  probabilidad: 0.55,
  cantidad_operaciones: 30,
};

const ENGINE_ROW_HEIGHT = 56;
const ENGINE_LIST_HEIGHT = 420;
const ENGINE_OVERSCAN = 6;

const LiveEngines = () => {
  const [status, setStatus] = useState(null);
  const [liveConfig, setLiveConfig] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [lotsDraft, setLotsDraft] = useState({});
  const [actionMsg, setActionMsg] = useState(null);
  const [filterMsg, setFilterMsg] = useState(null);
  const [engineScrollTop, setEngineScrollTop] = useState(0);
  const logsEndRef = useRef(null);
  const { logs, clearLogs } = useEngineSocket();

  const fetchStatus = async () => {
    try {
      const data = await getEngineStatus();
      setStatus(data);
    } catch {
      setStatus(null);
    }
  };

  const fetchLiveConfig = async () => {
    try {
      const data = await getLiveConfig();
      setLiveConfig(data.live);
      setFilters({
        winrate: data.live?.winrate ?? DEFAULT_FILTERS.winrate,
        profit_factor: data.live?.profit_factor ?? DEFAULT_FILTERS.profit_factor,
        expectancy: data.live?.expectancy ?? DEFAULT_FILTERS.expectancy,
        probabilidad: data.live?.probabilidad ?? DEFAULT_FILTERS.probabilidad,
        cantidad_operaciones: data.live?.cantidad_operaciones ?? DEFAULT_FILTERS.cantidad_operaciones,
      });
      const fromFiltered = Object.fromEntries(
        (data.live?.filtered_algorithms ?? []).map((e) => [e.engine_id, e.lot_size ?? 0.01]),
      );
      setLotsDraft(fromFiltered);
    } catch {
      setLiveConfig(null);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchStatus(), fetchLiveConfig()]);
  };

  useEffect(() => {
    refreshAll();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleStart = async () => {
    setActionMsg(null);
    try {
      const res = await startEngine();
      setActionMsg(res.status === "started"
        ? `Servidor iniciado — ${res.engines} engines cargados`
        : res.status === "already_running"
        ? "El servidor ya está en ejecución"
        : `Error: ${res.detail ?? res.status}`);
      fetchStatus();
    } catch (e) {
      setActionMsg("Error al iniciar el servidor");
    }
  };

  const handleStop = async (mode = "graceful") => {
    setActionMsg(null);
    try {
      const res = await stopEngine(mode);
      setActionMsg(res.status === "stopping"
        ? mode === "immediate"
          ? "Parada inmediata global enviada"
          : "Parada suave global enviada (espera cierres naturales)"
        : res.status === "not_running"
        ? "El servidor no está en ejecución"
        : res.status);
      fetchStatus();
    } catch {
      setActionMsg("Error al parar el servidor");
    }
  };

  const onFilterInput = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveFilters = async () => {
    setFilterMsg(null);
    try {
      await saveLiveConfig({
        winrate: Number(filters.winrate),
        profit_factor: Number(filters.profit_factor),
        expectancy: Number(filters.expectancy),
        probabilidad: Number(filters.probabilidad),
        cantidad_operaciones: Number(filters.cantidad_operaciones),
      });
      setFilterMsg("Filtros guardados correctamente");
      fetchLiveConfig();
    } catch {
      setFilterMsg("Error guardando filtros");
    }
  };

  const handleApplyFilter = async () => {
    setFilterMsg(null);
    try {
      const res = await applyLiveFilter();
      setFilterMsg(`Filtro aplicado: ${res.passed} de ${res.checked} estrategias pasan`);
      refreshAll();
    } catch {
      setFilterMsg("Error aplicando filtro");
    }
  };

  const handleLotSizeSave = async (engineId) => {
    const lot = Number(lotsDraft[engineId]);
    if (!Number.isFinite(lot) || lot <= 0) {
      setActionMsg("Lot size inválido");
      return;
    }
    try {
      await updateEngineLotSize(engineId, lot);
      setActionMsg(`Lot size actualizado para ${engineId}`);
      refreshAll();
    } catch {
      setActionMsg(`Error actualizando lot size de ${engineId}`);
    }
  };

  const handleStopEngine = async (engineId, mode) => {
    try {
      const res = await stopSingleEngine(engineId, mode);
      if (res.status === "ok") {
        if (res.result === "pending_close") {
          setActionMsg(`Parada suave solicitada para ${engineId}: pendiente de cierre de operación`);
        } else if (res.result === "already_stopped") {
          setActionMsg(`${engineId} ya estaba detenido`);
        } else if (res.result === "already_requested") {
          setActionMsg(`${engineId} ya tenía la parada solicitada`);
        } else {
          setActionMsg(`Parada ${mode} solicitada para ${engineId}`);
        }
      } else {
        setActionMsg(`No se pudo detener ${engineId}: ${res.status}`);
      }
      fetchStatus();
    } catch {
      setActionMsg(`Error al detener ${engineId}`);
    }
  };

  const running = status?.running ?? false;
  const collective = status?.collective;
  const filteredAlgorithms = liveConfig?.filtered_algorithms ?? [];
  const rawLiveEngines = running ? (status?.engines ?? []) : filteredAlgorithms;
  const rowPriority = (e) => {
    if (!running) return 0;
    if (!e?.active && !e?.is_open) return 3;
    if (e?.runtime_state === "pending_close") return 2;
    if (e?.stop_requested) return 2;
    return 1;
  };
  const liveEngines = [...rawLiveEngines].sort((a, b) => rowPriority(a) - rowPriority(b));
  const totalRows = liveEngines.length;
  const visibleRows = Math.ceil(ENGINE_LIST_HEIGHT / ENGINE_ROW_HEIGHT) + ENGINE_OVERSCAN;
  const startIndex = Math.max(0, Math.floor(engineScrollTop / ENGINE_ROW_HEIGHT) - Math.floor(ENGINE_OVERSCAN / 2));
  const endIndex = Math.min(totalRows, startIndex + visibleRows);
  const visibleEngines = liveEngines.slice(startIndex, endIndex);

  return (
    <div className="page">
      <h1>Live Engines</h1>

      <div className="live-filter-box">
        <h3>Filtros de algoritmos</h3>
        <div className="live-filter-grid">
          <label>
            Winrate
            <input
              type="number"
              step="0.01"
              value={filters.winrate}
              onChange={(e) => onFilterInput("winrate", e.target.value)}
            />
          </label>
          <label>
            Profit Factor
            <input
              type="number"
              step="0.01"
              value={filters.profit_factor}
              onChange={(e) => onFilterInput("profit_factor", e.target.value)}
            />
          </label>
          <label>
            Expectancy
            <input
              type="number"
              step="0.01"
              value={filters.expectancy}
              onChange={(e) => onFilterInput("expectancy", e.target.value)}
            />
          </label>
          <label>
            Probabilidad
            <input
              type="number"
              step="0.01"
              value={filters.probabilidad}
              onChange={(e) => onFilterInput("probabilidad", e.target.value)}
            />
          </label>
          <label>
            Operaciones
            <input
              type="number"
              step="1"
              value={filters.cantidad_operaciones}
              onChange={(e) => onFilterInput("cantidad_operaciones", e.target.value)}
            />
          </label>
        </div>
        <div className="engine-controls">
          <button onClick={handleSaveFilters}>Guardar filtros</button>
          <button onClick={handleApplyFilter}>Aplicar filtro</button>
          <span>
            Filtrados: {filteredAlgorithms.length}
            {liveConfig?.last_filter_applied_at ? ` · ${liveConfig.last_filter_applied_at}` : ""}
          </span>
        </div>
        {filterMsg && <p className="engine-msg">{filterMsg}</p>}
      </div>

      {/* ── Controles ── */}
      <div className="engine-controls">
        <button onClick={handleStart} disabled={running}>
          Start
        </button>
        <button onClick={() => handleStop("graceful")} disabled={!running} className="btn-warning">
          Stop suave
        </button>
        <button onClick={() => handleStop("immediate")} disabled={!running} className="btn-danger">
          Stop ahora
        </button>
        <span className={`engine-badge ${running ? "badge-running" : "badge-stopped"}`}>
          {running ? "RUNNING" : "STOPPED"}
        </span>
      </div>

      {actionMsg && <p className="engine-msg">{actionMsg}</p>}

      {collective && (
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-label">Activos</div>
            <div className="stat-value">{collective.active_engines}/{collective.total_engines}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Operaciones abiertas</div>
            <div className="stat-value">{collective.open_positions}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Trades cerrados</div>
            <div className="stat-value">{collective.closed_trades}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Winrate</div>
            <div className="stat-value">{(collective.winrate * 100).toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pips total</div>
            <div className="stat-value">{collective.total_pips.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* ── Logs ── */}
      <div className="logs-header">
        <span>Logs</span>
        <button onClick={clearLogs} className="btn-sm">Limpiar</button>
      </div>
      <div className="logs">
        {logs.length === 0 && <span className="logs-empty">Sin logs todavía...</span>}
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* ── Engines activos ── */}
      {liveEngines.length > 0 && (
        <div className="engine-list-panel">
          <div className="engine-vlist-header">
            <span>Algoritmo</span>
            <span>Estado</span>
            <span>Lot Size</span>
            <span>Acciones</span>
            <span>Stats</span>
          </div>
          <div
            className="engine-vlist-scroll"
            style={{ height: `${ENGINE_LIST_HEIGHT}px` }}
            onScroll={(ev) => setEngineScrollTop(ev.currentTarget.scrollTop)}
          >
            <div
              className="engine-vlist-inner"
              style={{ height: `${totalRows * ENGINE_ROW_HEIGHT}px` }}
            >
              {visibleEngines.map((e, i) => {
                const rowIndex = startIndex + i;
                return (
                  <div
                    key={e.engine_id ?? rowIndex}
                    className={`engine-vrow ${e.is_open ? "engine-vrow-open" : ""} ${e.runtime_state === "pending_close" ? "engine-vrow-stopping" : ""} ${!e.active && !e.is_open ? "engine-vrow-inactive" : ""}`}
                    style={{
                      top: `${rowIndex * ENGINE_ROW_HEIGHT}px`,
                      height: `${ENGINE_ROW_HEIGHT}px`,
                    }}
                  >
                    <div className="engine-vcell engine-vsymbol">
                      <div className="engine-symbol">{e.symbol}</div>
                      <div className="engine-meta">{e.mercado} · {e.algo ?? e.algorithm}</div>
                    </div>

                    <div className="engine-vcell">
                      <div className={`engine-trade ${e.runtime_state === "pending_close" ? "trade-pending" : e.is_open ? "trade-open" : "trade-closed"}`}>
                        {e.runtime_state === "pending_close"
                          ? "Pendiente de cierre"
                          : e.is_open
                          ? "Abierto"
                          : !e.active
                          ? "Detenido"
                          : "Sin posición"}
                      </div>
                    </div>

                    <div className="engine-vcell engine-lot-row">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={lotsDraft[e.engine_id] ?? e.lot_size ?? 0.01}
                        onChange={(ev) => setLotsDraft((prev) => ({ ...prev, [e.engine_id]: ev.target.value }))}
                      />
                      <button className="btn-sm btn-row-save" onClick={() => handleLotSizeSave(e.engine_id)}>
                        <span className="btn-icon" aria-hidden="true">◧</span>
                        Guardar
                      </button>
                    </div>

                    <div className="engine-vcell engine-stop-row">
                      {running && e.active ? (
                        <>
                          <button
                            className="btn-sm btn-row-graceful"
                            disabled={e.stop_requested}
                            onClick={() => handleStopEngine(e.engine_id, "graceful")}
                          >
                            <span className="btn-icon" aria-hidden="true">◔</span>
                            Al cerrar
                          </button>
                          <button
                            className="btn-sm btn-row-immediate"
                            disabled={e.stop_requested && e.stop_mode === "immediate"}
                            onClick={() => handleStopEngine(e.engine_id, "immediate")}
                          >
                            <span className="btn-icon" aria-hidden="true">✕</span>
                            Ahora
                          </button>
                        </>
                      ) : (
                        <span className="engine-meta">
                          {e.runtime_state === "pending_close" ? "Esperando cierre" : "No activo"}
                        </span>
                      )}
                    </div>

                    <div className="engine-vcell engine-meta">
                      {e.stats
                        ? `T ${e.stats.closed_trades} · WR ${(e.stats.winrate * 100).toFixed(1)}% · P ${e.stats.total_pips.toFixed(1)}`
                        : "Sin stats"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="engine-vlist-footer">
            Mostrando {startIndex + 1}-{Math.max(startIndex + visibleEngines.length, 0)} de {totalRows}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveEngines;
