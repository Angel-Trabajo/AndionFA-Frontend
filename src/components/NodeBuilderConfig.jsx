import {useEffect} from 'react'
import { useConfig } from '../context/ConfigContext'
import { getNodeConfig } from '../service/FastService'
import '../styles/NodeBuilderConfig.css'


const NodeBuilderConfig = () => {
  const { dataConfig, setdataConfig } = useConfig()
  
  

  useEffect(()=>{
    const fetcgetNodeConfig = async () => {
      const data = await getNodeConfig()
      setdataConfig(data.data|| {})
    }
    fetcgetNodeConfig()
  },[])

  return (
    <div>
      <h2>Configuracion Node Builder</h2>
        <div className="date-range">
        <label>
            Fecha de inicio:
            <input
            type="date"
            value={dataConfig.dateStart || ''}
            onChange={(e) => setdataConfig(prev =>({...prev, dateStart: e.target.value}))}
            />
        </label>

        <label>
            Fecha final:
            <input
            type="date"
            value={dataConfig.dateEnd || ''}
            onChange={(e) => setdataConfig(prev =>({...prev, dateEnd: e.target.value}))}
            />
        </label>
        </div>

        <div className='for-node'>
          <label >
            Max Depth
            <input type="text" value={dataConfig.maxDepth || ''} onChange={(e) => setdataConfig(prev =>({...prev, maxDepth: e.target.value}))}/>
          </label>
          <label>
            NTotal
            <input type="text" value={dataConfig.NTotal || ''} onChange={(e) => setdataConfig(prev =>({...prev, NTotal: e.target.value}))}/>
          </label>
          <label>
            Similarity Max
            <input type="text" value={dataConfig.SimilarityMax || ''} onChange={(e) => setdataConfig(prev =>({...prev, SimilarityMax: e.target.value}))}/>
          </label>
          <label>
            Min Operations IS
            <input type="text" value={dataConfig.MinOperationsIS || ''} onChange={(e) => setdataConfig(prev =>({...prev, MinOperationsIS: e.target.value}))}/>
          </label>
          <label>
            Min Operations OS
            <input type="text" value={dataConfig.MinOperationsOS || ''} onChange={(e) => setdataConfig(prev =>({...prev, MinOperationsOS: e.target.value}))}/>
          </label>
          <label>
            Num Max Operations
            <input type="text" value={dataConfig.NumMaxOperations || ''} onChange={(e) => setdataConfig(prev =>({...prev, NumMaxOperations: e.target.value}))}/>
          </label>
          <label>
            Min Success Rate
            <input type="text" value={dataConfig.MinSuccessRate || ''} onChange={(e) => setdataConfig(prev =>({...prev, MinSuccessRate: e.target.value}))}/>
          </label>
          <label>
            Max Success Rate
            <input type="text" value={dataConfig.MaxSuccessRate || ''} onChange={(e) => setdataConfig(prev =>({...prev, MaxSuccessRate: e.target.value}))}/>
          </label>
          <label>
            Progressive Variation
            <input type="text" value={dataConfig.ProgressiveVariation || ''} onChange={(e) => setdataConfig(prev =>({...prev, ProgressiveVariation: e.target.value}))}/>
          </label>
          
        </div>
    </div>
  )
}

export default NodeBuilderConfig