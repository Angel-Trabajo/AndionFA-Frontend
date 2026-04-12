import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMt5Status } from "../service/FastService";
import { useConfig } from "../context/ConfigContext";

const Item = ({ to, label, location, blocked }) => {
  if (blocked && location.pathname !== to) {
    return (
      <span
        className="sideItem sideItem-blocked"
        title="El pipeline está en ejecución. Detenlo antes de navegar."
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      to={to}
      className={`sideItem ${location.pathname === to ? "active" : ""}`}
    >
      {label}
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { isRunning } = useConfig();
  const [mt5, setMt5] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMt5Status();
        setMt5(data);
      } catch {
        setMt5({ connected: false });
      }
    };
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      <div className="logo">TRADING AI</div>

      {isRunning && (
        <div className="sidebar-running-badge">
          ⏳ Pipeline corriendo
        </div>
      )}

      <Item to="/"          label="Dashboard"    location={location} blocked={isRunning} />
      <Item to="/config"    label="Config"        location={location} blocked={isRunning} />
      <Item to="/extractor" label="Extractor"     location={location} blocked={isRunning} />
      <Item to="/execute"   label="Execute"       location={location} blocked={false} />
      <Item to="/live"      label="Live Engines"  location={location} blocked={isRunning} />
      <Item to="/nodes"     label="Nodes"         location={location} blocked={isRunning} />
      <Item to="/backtest"  label="Backtest"      location={location} blocked={isRunning} />
      <Item to="/backup"    label="Backup DB"     location={location} blocked={isRunning} />

      <div className="sidebar-spacer" />

      <div className={`mt5-badge ${mt5?.connected ? "mt5-on" : "mt5-off"}`}>
        MT5 {mt5 === null ? "..." : mt5.connected ? "● ON" : "● OFF"}
        {mt5?.connected && mt5.balance != null && (
          <span className="mt5-balance"> {mt5.balance} {mt5.currency}</span>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
