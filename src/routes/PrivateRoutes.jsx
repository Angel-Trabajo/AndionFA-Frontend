import { Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";



const PrivateRoutes = (
  <Route>
    <Route path="/" element={<Dashboard />} />
  </Route>
);

export default PrivateRoutes;
