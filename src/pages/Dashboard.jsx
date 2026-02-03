import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SelectFileExtract from "../components/SelectFileExtract"
import SelectConfig from "../components/SelectConfig"
import NodesCom from "../components/NodesCom"
import { useConfig } from "../context/ConfigContext"
import { sendIndicatorsRequest, postNodeConfig } from '../service/FastService'
import NodeBuilderConfig from "../components/NodeBuilderConfig"

const Dashboard = () => {
    const{selectedFiles, selectedSymbol, selectedTimeframe, startDate, endDate} = useConfig()
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [element, setElement] = useState('Extraer')
    const { dataConfig} = useConfig()
    const navigate = useNavigate()

    const postData = async () => {
        if(element==='Configurar'){
            if (dataConfig.dateStart > dataConfig.dateEnd) {
            return alert("La fecha de inicio no puede ser mayor que la fecha de fin");
            }
            await postNodeConfig(dataConfig)
            navigate('/node-builder')

        }else{
           if (selectedFiles.length === 0) {
            return alert("Debe seleccionar al menos un archivo");
        }

        if (startDate > endDate) {
            return alert("La fecha de inicio no puede ser mayor que la fecha de fin");
        }

        const data = {
            symbol: selectedSymbol,
            timeframe: selectedTimeframe,
            start: startDate,
            end: endDate,
            indicators_files: selectedFiles,
        };

        setLoading(true);
        setMessage("Extrayendo datos...");

        try {
            await sendIndicatorsRequest(data);
            setMessage("Extracción completada");
        } catch (error) {
            setMessage("Ocurrió un error durante la extracción");
        } finally {
            setTimeout(() => {
            setLoading(false);
            setMessage('');
            }, 100); // opcional: espera 1/2 segundos para cerrar el mensaje
        } 
        }
        
        };


  return (
    <div>
      
        <div className="dashboard">
            <div className="dashboardLeft">
                <NodesCom setElement={setElement}/>
            </div>
            <div className="dashboardRight">
                {
                 element==='Extraer'
                 ?<>
                 <div className="select-config">
                    <div className="internalConfig">
                        <SelectConfig />
                        <div className="internalConfigSlow">
                            {loading && (
                            <div className="app-blocker">
                                <div className="loading-box">
                                <p>{message}</p>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                    <SelectFileExtract />
                </div>
                 </> 
                 :<>
                    <NodeBuilderConfig/>
                 </>  
                }
                
                <button className="extraer" onClick={postData}>{element}</button>
            </div>
        </div>
    </div>
  )
}

export default Dashboard