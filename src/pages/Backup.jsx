import { useEffect, useRef, useState } from "react";
import {
  listBackups,
  createBackup,
  restoreBackup,
  getBackupDownloadUrl,
} from "../service/FastService";

const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("ok");
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const data = await listBackups();
      setBackups(data.backups || []);
    } catch {
      setBackups([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (text, type = "ok") => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(null), 4000);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await createBackup();
      notify(`Backup creado: ${res.file}`);
      load();
    } catch {
      notify("Error al crear el backup", "err");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (file) => {
    if (!window.confirm(`¿Restaurar la base de datos desde ${file}?\nEsta acción sobreescribe los datos actuales.`)) return;
    try {
      await restoreBackup(file);
      notify(`Base de datos restaurada desde ${file}`);
    } catch (e) {
      notify(`Error al restaurar: ${e?.response?.data?.detail ?? e.message}`, "err");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_FAST_API || "http://localhost:8000"}/config/backup/upload`,
        { method: "POST", body: formData }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail);
      }
      notify("Backup subido y restaurado correctamente");
      load();
    } catch (err) {
      notify(`Error al subir: ${err.message}`, "err");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="page">
      <h1>Database Backup</h1>

      <div className="engine-controls">
        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Creando..." : "Crear Backup"}
        </button>
        <button
          className="btn-secondary"
          onClick={() => fileRef.current?.click()}
        >
          Subir &amp; Restaurar .sql
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".sql"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>

      {msg && <p className={msgType === "ok" ? "status-ok" : "status-err"}>{msg}</p>}

      <div className="nodes-table-wrap" style={{ marginTop: 16 }}>
        <table className="nodes-table">
          <thead>
            <tr>
              <th>Archivo</th>
              <th style={{ width: 220 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {backups.length === 0 && (
              <tr>
                <td colSpan={2} style={{ color: "#9ca3af", textAlign: "center" }}>
                  Sin backups disponibles
                </td>
              </tr>
            )}
            {backups.map((b) => (
              <tr key={b}>
                <td className="backup-filename">{b}</td>
                <td>
                  <div className="backup-actions">
                    <a
                      href={getBackupDownloadUrl(b)}
                      download={b}
                      className="btn-link"
                    >
                      Descargar
                    </a>
                    <button
                      className="btn-warning btn-sm"
                      onClick={() => handleRestore(b)}
                    >
                      Restaurar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Backup;
