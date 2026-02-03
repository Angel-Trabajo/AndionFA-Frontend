import { useEffect, useState}from 'react'
import { useNavigate } from 'react-router-dom'
import CrossingBuilderConfig from '../components/CrossingBuilderConfig'
import { getCrossingDbs, getNodesCrossind, postStopTest, postStartCrossing, postStopCrossing, getPrincipalSymbol, postStartTestCross, getCrossingState } from '../service/FastService'
import Nodo from '../components/Nodo'
import '../styles/CrossingBuilder.css'
import { set } from 'react-hook-form'


const CrossingBuilder = () => {
  const [dbs, setDbs] = useState([])
  const [symbolSelect, setSymbolSelect] = useState('')
  const [future, setFuture] = useState('no')
  const [nodes, setNodes] = useState([]);
  const [principalSymbol, setPrincipalSymbol] = useState('')
  const [nodesUp, setNodesUp] = useState([]);
  const [nodesDown, setNodesDown] = useState([]);
  const [nodesTest, setNodesTest] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const [isRunning, setIsRunning] = useState(()=>{
    const valor = localStorage.getItem("isRun")
    if(valor === null || valor === 'Stop'){
      return false
    }else if(valor === "Run"){
      return true
    }else{
      return false
    }
  }); 
  const navigate = useNavigate();


  useEffect(()=>{
    const fetchCrossinDbs = async () =>{
      const res = await getCrossingDbs()
      setDbs(res.dir)
    }
    const fecthGetPrincipalSymbol = async () =>{
      const res = await getPrincipalSymbol()
      setPrincipalSymbol(res.symbol)
    }
    fetchCrossinDbs()
    fecthGetPrincipalSymbol()
  },[])

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(async () => {
      try {
          const state = await getCrossingState();
          console.log(state.state)//-------------------------------
          if (state.state === "stopped") {
              clearInterval(intervalId);
              setIsRunning(false);
              localStorage.setItem("isRun", "Stop");
          }
          const res = await getCrossingDbs()
          setDbs(res.dir)
          if(symbolSelect) {
            const response = await getNodesCrossind(symbolSelect)
            setNodes(response.data)
            //console.log(response)//--------------------------------
            if (Array.isArray(response.data) && response.data.length > 0) {
                setNodesDown(response.data.filter(node => node[1] === 'DOWN'));
                setNodesUp(response.data.filter(node => node[1] === 'UP'));
            }
          }
      } catch (error) {
          console.error('Error fetching nodes:', error);
          clearInterval(intervalId);
          setIsRunning(false);
      }
      }, 10000);
      return () => clearInterval(intervalId);
  }, [dbs, isRunning, nodes, symbolSelect]);





  const handleMenuClick = () => {
    navigate('/'); // Redirige al menú principal
  };

  const getNodos = async (symbol) => {
    setNodesTest([])
    setNodesDown([])
    setNodesUp([])
    const response = await getNodesCrossind(symbol)
    setNodes(response.data)
    setSymbolSelect(symbol.split('.')[0])
    console.log(response)//--------------------------------
    if (Array.isArray(response.data) && response.data.length > 0) {
        setNodesDown(response.data.filter(node => node[1] === 'DOWN'));
        setNodesUp(response.data.filter(node => node[1] === 'UP'));
      }
  }

  const startCrossing = async () => {
    setDbs([])
    setNodesTest([])
    setNodesDown([])
    setNodesUp([])
    const response = await postStartCrossing() 
    localStorage.setItem("isRun", "Run");
    setIsRunning(true);
    alert('Crossing Builder Ejecutado')
  }

  const stopCrossing = async () => {
    localStorage.setItem("isRun", "Stop");
    setIsRunning(false);
    try{
      const response = await postStopCrossing() 
      if(response.message === 'Proceso detenido'){
        alert('Crossing Builder Detenido')
      }
      else if(response.message === 'No hay proceso corriendo'){
        alert('Crossing Builder no esta ejecutándose');
      }
    }catch (error) {
      console.error('Error stopping crossing:', error);
    }
    }


   const startTest = async () => {
    try {

      const response = await postStartTestCross({ prin_symbol: principalSymbol, symbol:symbolSelect, list_id: nodesTest, future: future });

      //setNodesTest([]); // Limpiar selección
      setTestRunning(true);
      alert('Test iniciado con éxito.');
  
      // Esperar un poco para dar tiempo al backend a preparar el WebSocket
      setTimeout(() => {
        const socket = new WebSocket("ws://localhost:8000/config/ws/test-status");
  
        socket.onopen = () => {
          console.log("✅ WebSocket conectado");
        };
  
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("📩 Mensaje recibido del WebSocket:", data);
  
          if (data.status === "finished") {
            setTestRunning(false);
            alert("✅ ¡Test finalizado!");
            socket.close();
            setNodesTest([])
          }
        };
  
        socket.onerror = (err) => {
          console.error("❌ Error en WebSocket:", err);
          socket.close();
        };
  
        socket.onclose = () => {
          console.log("🔌 WebSocket cerrado");
        };
      }, 2000); // ⏱ Espera 2 segundos antes de conectar
  
    } catch (error) {
      console.error("❌ Error al iniciar el test:", error);
      alert("Hubo un error al iniciar el test.");
    }
  };

  const stopTest = async () => {
    await postStopTest();
    setTestRunning(false);
    alert('Prueba detenida con éxito.');
    setNodesTest([]);
  };

  return (
    <div>
        <div>
            <CrossingBuilderConfig/>
        </div>
        {
          nodesTest.length > 0 && (() => {
            const nodosSelect = nodes.filter(node => nodesTest.includes(parseInt(node[0])));
            const nodosSelectLabel = nodes.filter(node => node[1] === nodosSelect[0][1])
            return (
              <div className="test-info">
                {future === 'yes'? (
                  <>
                    <span>Porcentaje de Acierto IS: {(nodosSelectLabel.reduce((acc, node) => acc + parseFloat(node[4]), 0) / nodosSelectLabel.length * 100).toFixed(2)}%</span>
                    <span>Operaciones Acertadas IS: {nodosSelectLabel.reduce((acc, node) => acc + node[5], 0)}</span>
                    <span>Operaciones IS: {nodosSelectLabel.reduce((acc, node) => acc + node[6], 0)}</span>
                    <span>Porcentaje de Acierto OS: {(nodosSelectLabel.reduce((acc, node) => acc + parseFloat(node[7]), 0) / nodosSelectLabel.length * 100).toFixed(2)}%</span>
                    <span>Operaciones Acertadas OS: {nodosSelectLabel.reduce((acc, node) => acc + node[8], 0)}</span>
                  </>
                ):(
                  <>
                    <span>Porcentaje de Acierto IS: {(nodosSelect.reduce((acc, node) => acc + parseFloat(node[4]), 0) / nodosSelect.length * 100).toFixed(2)}%</span>
                    <span>Operaciones Acertadas IS: {nodosSelect.reduce((acc, node) => acc + node[5], 0)}</span>
                    <span>Operaciones IS: {nodosSelect.reduce((acc, node) => acc + node[6], 0)}</span>
                    <span>Porcentaje de Acierto OS: {(nodosSelect.reduce((acc, node) => acc + parseFloat(node[7]), 0) / nodosSelect.length * 100).toFixed(2)}%</span>
                    <span>Operaciones Acertadas OS: {nodosSelect.reduce((acc, node) => acc + node[8], 0)}</span>
                  </>
                )}
                <span>Operaciones OS: {nodosSelect.reduce((acc, node) => acc + node[9], 0)}</span>
              </div>
            );
          })()
        }

        <div className='container'>
            <div className='button-container'>
                <div>
                    <button onClick={handleMenuClick}>Menú Principal</button>
                    <button onClick={startCrossing}>Ejecutar</button> 
                    <button onClick={stopCrossing}>Detener</button>
                </div>
                <div>
                    {symbolSelect}
                </div>
                <div>
                    <input type="checkbox" checked={future === 'yes'} onChange={(e) => setFuture(e.target.checked ? 'yes' : 'no')} />
                    <button disabled={nodesTest.length === 0} style={{backgroundColor: nodesTest.length === 0 ? 'gray' : '#4CAF50'}} onClick={startTest}>Testear</button>
                    <button disabled={!testRunning} style={{backgroundColor: testRunning ? '#4CAF50' : 'gray'}} onClick={stopTest}>Detener</button> 
                </div>
            </div>
            <div className='body-container'>
                <div className='dbs-container'>
                    {dbs.map((db, index)=>(
                      <div key={index} className='db-container' onClick={()=>getNodos(db)}>
                        {db.split('.')[0]}
                      </div>
                    ))}
                </div>
                <div className='container-node'>
                    {Array.isArray(nodesUp) &&
                    nodesUp.map((node, index) => (
                      node[1]==='END'
                      ?<span key={index}></span>
                      :<Nodo key={index} node={node} setNodesTest={setNodesTest} nodesTest={nodesTest} future={future}/>
                    ))}
                </div>
                <div className='container-node'>
                    {Array.isArray(nodesDown) &&
                      nodesDown.map((node, index) => (
                        node[1]==='END'
                        ?<span key={index}></span>
                        :<Nodo key={index} node={node} setNodesTest={setNodesTest} nodesTest={nodesTest} future={future}/>
                      ))}
                </div>
            </div>
            <div className="node-footer">
              <span>Nodos UP: {nodesUp.length}</span>
              {isRunning?<><h3 style={{color: 'green'}}>Ejecutándose...</h3></>:<h3>Detenido</h3>}
              <span>Nodos DOWN: {nodesDown.length}</span>
          </div>
        </div>
        
    </div>
  )
}

export default CrossingBuilder