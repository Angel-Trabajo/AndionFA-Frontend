import React from 'react'
import {useNavigate} from 'react-router-dom'
import { postStartNeuronalRed } from '../service/FastService'


const Neuronal = () => {
  const navigate = useNavigate()

  const handleExecute = async () => {
    try {
      await postStartNeuronalRed();
    } catch (error) {
      console.error("Error executing neuronal red:", error);
    }
  };

  return (
    <div>
        <button onClick={()=>navigate('/')}>Menú Principal</button>
        <button onClick={handleExecute}>Ejecutar</button>
    </div>
  )
}

export default Neuronal