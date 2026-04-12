import { useEffect, useRef, useState } from "react";
import { startEngine, stopEngine, getEngineStatus } from "../service/FastService";
import { useEngineSocket } from "../hooks/useEngineSocket";

const LiveEngines = () => {
  const [status, setStatus] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
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

  useEffect(() => {
    fetchStatus();
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

  const handleStop = async () => {
    setActionMsg(null);
    try {
      const res = await stopEngine();
      setActionMsg(res.status === "stopping"
        ? "Enviando señal de parada..."
        : res.status === "not_running"
        ? "El servidor no está en ejecución"
        : res.status);
      fetchStatus();
    } catch {
      setActionMsg("Error al parar el servidor");
    }
  };

  const running = status?.running ?? false;

  return (
    <div className="page">
      <h1>Live Engines</h1>

      {/* ── Controles ── */}
      <div className="engine-controls">
        <button onClick={handleStart} disabled={running}>
          Start
        </button>
        <button onClick={handleStop} disabled={!running} className="btn-danger">
          Stop
        </button>
        <span className={`engine-badge ${running ? "badge-running" : "badge-stopped"}`}>
          {running ? "RUNNING" : "STOPPED"}
        </span>
      </div>

      {actionMsg && <p className="engine-msg">{actionMsg}</p>}

      {/* ── Engines activos ── */}
      {status?.engines?.length > 0 && (
        <div className="engine-grid">
          {status.engines.map((e, i) => (
            <div key={i} className={`engine-card ${e.is_open ? "card-open" : ""}`}>
              <div className="engine-symbol">{e.symbol}</div>
              <div className="engine-meta">{e.mercado} · {e.algo}</div>
              <div className={`engine-trade ${e.is_open ? "trade-open" : "trade-closed"}`}>
                {e.is_open ? "● Trade abierto" : "○ Sin posición"}
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default LiveEngines;
