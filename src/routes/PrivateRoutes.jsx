import { Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import NodeBuilder from "../pages/NodeBuilder";
import CrossingBuilder from "../pages/CrossingBuilder";
import Neuronal from "../pages/Neuronal";


const PrivateRoutes = (
  <Route>
    <Route path="/" element={<Dashboard />} />
    <Route path="/node-builder" element={<NodeBuilder />} />
    <Route path="/crossing-builder" element={<CrossingBuilder/>} />
    <Route path="/neuronal" element={<Neuronal/>} />
  </Route>
);

export default PrivateRoutes;
