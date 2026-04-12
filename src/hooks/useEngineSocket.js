import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_FAST_API
  ? import.meta.env.VITE_FAST_API.replace(/^http/, "ws") + "/engine/ws"
  : "ws://localhost:8000/engine/ws";

export const useEngineSocket = () => {
  const [logs, setLogs] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.logs && data.logs.length > 0) {
        setLogs((prev) => [...prev, ...data.logs]);
      }
    };

    ws.onerror = () => {
      setLogs((prev) => [...prev, "⚠️ WebSocket connection error"]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const clearLogs = () => setLogs([]);

  return { logs, clearLogs };
};
