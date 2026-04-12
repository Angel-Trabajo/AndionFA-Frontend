import { Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Config from "../pages/Config";
import Extractor from "../pages/Extractor";
import Execute from "../pages/Execute";
import LiveEngines from "../pages/LiveEngines";
import Nodes from "../pages/Nodes";
import Backtest from "../pages/Backtest";
import Backup from "../pages/Backup";

const AppRoutes = (
  <>
    <Route path="/" element={<Dashboard />} />
    <Route path="/config" element={<Config />} />
    <Route path="/extractor" element={<Extractor />} />
    <Route path="/execute" element={<Execute />} />
    <Route path="/live" element={<LiveEngines />} />
    <Route path="/nodes" element={<Nodes />} />
    <Route path="/backtest" element={<Backtest />} />
    <Route path="/backup" element={<Backup />} />
  </>
);

export default AppRoutes;
