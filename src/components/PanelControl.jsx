import React from 'react'
import { executeAlgorithm } from '../service/FastService'

const PanelControl = () => {
    
  const handleExecute = async () => {
    alert("Ejecutando algoritmo...");   
    try {
      const result = await executeAlgorithm();
      console.log("Algorithm executed successfully:", result);
    } catch (error) {
      console.error("Error executing algorithm:", error);
    }
  };

  return (
    <div>
        <button onClick={handleExecute}>Execute</button>
    </div>
  )
}

export default PanelControl