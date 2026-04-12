import { useRef, useState, useEffect } from "react";
import { executeAlgorithm, stopAlgorithm, getExecuteProgress } from "../service/FastService";
import { useConfig } from "../context/ConfigContext";

const STEP_LABELS = {
  create_files:      "Fase 1 — Creando archivos de indicadores",
  node_builder:      "Fase 2 — Construyendo nodos",
  crossing_builder:  "Fase 2 — Cruzando nodos",
  data_neuronal:     "Fase 2 — Preparando datos neuronal",
  entrenar:          "Fase 2 — Entrenando red neuronal",
  backtest:          "Fase 2 — Backtest",
};

const Execute = () => {
  const { isRunning, setIsRunning } = useConfig();
  const [loading, setLoading]       = useState(false);
  const [resetDb, setResetDb]       = useState(false);
  const [status, setStatus]         = useState(null);
  const [progress, setProgress]     = useState(null);
  const [localLogs, setLocalLogs]   = useState([]);
  const prevLogsLenRef = useRef(0);
  const logsEndRef     = useRef(null);
  const pollRef        = useRef(null);

  // Auto-scroll al nuevo log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localLogs]);

  // Cuando llegan nuevos logs en progress, añadirlos al estado local
  useEffect(() => {
    if (progress?.logs) {
      const offset = progress.logs_offset ?? 0;
      // prevLogsLenRef guarda la posición absoluta (offset + índice en lista)
      const relativeStart = Math.max(0, prevLogsLenRef.current - offset);
      const newEntries = progress.logs.slice(relativeStart);
      if (newEntries.length > 0) {
        setLocalLogs(prev => [...prev, ...newEntries]);
        prevLogsLenRef.current = offset + progress.logs.length;
      }
    }
  }, [progress]);

  // Al montar: consultar el backend — si ya está corriendo, restaurar el estado
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        const p = await getExecuteProgress();
        if (p.running) {
          setLoading(true);
          setIsRunning(true);
          setStatus("running");
          setProgress(p);
          // Restaurar logs acumulados
          if (p.logs?.length) {
            setLocalLogs(p.logs);
            prevLogsLenRef.current = (p.logs_offset ?? 0) + p.logs.length;
          }
        }
      } catch { /* ignorar */ }
    };
    checkInitialState();
  }, []);

  // Polling mientras loading=true
  useEffect(() => {
    if (loading) {
      pollRef.current = setInterval(async () => {
        try {
          const p = await getExecuteProgress();
          setProgress(p);
          if (!p.running) {
            setLoading(false);
            setIsRunning(false);
            setStatus(p.done > 0 ? "done" : "stopped");
          }
        } catch { /* ignorar errores de poll */ }
      }, 2000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [loading]);

  const run = async () => {
    setLoading(true);
    setIsRunning(true);
    setStatus(null);
    setProgress(null);
    setLocalLogs([]);
    prevLogsLenRef.current = 0;
    try {
      await executeAlgorithm(resetDb);
      setStatus("running");
    } catch {
      setStatus("error");
      setLoading(false);
      setIsRunning(false);
    }
  };

  const stop = async () => {
    try {
      await stopAlgorithm();
      setLoading(false);
      setIsRunning(false);
      setStatus("stopped");
    } catch { /* ignorar */ }
  };

  const pct = progress && progress.total > 0
    ? Math.round((progress.done / progress.total) * 100)
    : 0;

  return (
    <div className="page">
      <h1>Execute Pipeline</h1>

      {/* Options */}
      <div className="exec-options">
        <label className="exec-checkbox">
          <input
            type="checkbox"
            checked={resetDb}
            onChange={(e) => setResetDb(e.target.checked)}
            disabled={loading}
          />
          Reset base de datos (comenzar desde cero)
        </label>
        {!resetDb && (
          <span className="exec-resume-hint">
            Se saltarán los pares ya completados y se continuará desde el último pendiente.
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="engine-controls">
        <button onClick={run} disabled={loading}>
          {loading ? "Ejecutando..." : "Comenzar"}
        </button>
        {loading && (
          <button className="btn-danger" onClick={stop}>
            Detener
          </button>
        )}
      </div>

      {/* Status messages */}
      {status === "error"   && <p className="status-err">Error al lanzar el pipeline</p>}
      {status === "running" && <p className="status-ok">Pipeline en ejecución — logs en tiempo real:</p>}
      {status === "stopped" && <p className="status-err">Detenido por el usuario</p>}
      {status === "done"    && <p className="status-ok">Pipeline completado ✓</p>}

      {/* Progress */}
      {progress && (
        <div className="exec-progress">
          <div className="exec-progress-header">
            <span>{progress.done} / {progress.total} pares completados</span>
            <span className="exec-pct">{pct}%</span>
          </div>
          <div className="exec-progress-bar">
            <div className="exec-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          {progress.current && (
            <div className="exec-progress-detail">
              <strong>Procesando:</strong> {progress.current}
              {progress.step && (
                <span className="exec-step"> — {STEP_LABELS[progress.step] ?? progress.step}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logs */}
      <div className="logs-header">
        <span>Logs</span>
        <button onClick={() => { setLocalLogs([]); prevLogsLenRef.current = (progress?.logs_offset ?? 0) + (progress?.logs?.length ?? 0); }} className="btn-sm">Limpiar</button>
      </div>
      <div className="logs">
        {localLogs.length === 0 && <span className="logs-empty">Sin logs todavía...</span>}
        {localLogs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default Execute;

