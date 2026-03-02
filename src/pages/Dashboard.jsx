import { useState } from "react"
import SelectFileExtract from "../components/SelectFileExtract"
import NodesCom from "../components/NodesCom"
import PanelControl from "../components/PanelControl"



const Dashboard = () => {
   
    
  return (
    <div>      
        <div className="dashboard">
            <div className="dashboardLeft">
                <NodesCom />
            </div>
            
            <div className="select-config">
                <div className="internalConfig">
                    <PanelControl />
                </div>
                <SelectFileExtract />
            </div>
            
        </div>
    </div>
  )
}

export default Dashboard