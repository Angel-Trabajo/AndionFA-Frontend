import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postExcuteNodeBuilder, getNodes, getSymbolExtrac, postStartTest, postStopTest } from '../service/FastService';
import { useConfig } from '../context/ConfigContext';
import Nodo from '../components/Nodo';
import '../styles/NodeBuilder.css'

const NodeBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [nodesUp, setNodesUp] = useState([]);
  const [nodesDown, setNodesDown] = useState([]);
  const [nodesTest, setNodesTest] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const { selectedSymbol, selectedTimeframe } = useConfig();
  const navigate = useNavigate();
  const [symbolExtrac, setSymbolExtract] = useState('')
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
  

  const data = {
    symbol: selectedSymbol,
    timeframe: selectedTimeframe,
  };


  useEffect(() => {
    //localStorage.setItem("isRun", "Stop")
    console.log(localStorage.getItem("isRun"))///-------------
    if (!selectedSymbol) {
      navigate('/');
      return;
    }
    const fecthNode = async()=>{
      const result = await getNodes({ symbol: selectedSymbol });
      setNodes(result.data);
      //console.log(result.data)//----------
      if (Array.isArray(result.data) && result.data.length > 0) {
        setNodesDown(result.data.filter(node => node[1] === 'DOWN'));
        setNodesUp(result.data.filter(node => node[1] === 'UP'));
      }
    }
    const fecthSymbolExtrac = async()=>{
      const result = await getSymbolExtrac();
      setSymbolExtract(result.data)
    }
    fecthNode() 
    fecthSymbolExtrac()

  }, [selectedSymbol, navigate]);


  useEffect(() => {
    if (!isRunning) return; // Si no está activo, no hace nada

    const intervalId = setInterval(async () => {
        try {
            const result = await getNodes({ symbol: selectedSymbol });
            setNodes(result.data);
            if (Array.isArray(result.data) && result.data.length > 0) {
              setNodesDown(result.data.filter(node => node[1] === 'DOWN'));
              setNodesUp(result.data.filter(node => node[1] === 'UP'));
            }
            if (Array.isArray(result.data) && result.data.length > 0) {
            const lastArray = result.data[result.data.length - 1];
            if (lastArray && lastArray[1] === 'END' && symbolExtrac === selectedSymbol) {
                clearInterval(intervalId);
                localStorage.setItem("isRun", "Stop")
                setIsRunning(false)
            }
            }
        } catch (error) {
            console.error('Error fetching nodes:', error);
            clearInterval(intervalId);
            setIsRunning(false);
        }
        }, 10000);

    return () => clearInterval(intervalId); // Limpiar al desmontar o cuando cambie isRunning
  }, [isRunning, selectedSymbol, nodes]);

  

  const executeNode = async () => {
    if(isRunning){
      alert('Ya el Node Builder se esta Ejecutando')
    }else if(symbolExtrac !== selectedSymbol) {
      alert(`La extracción del símbolo seleccionado ${selectedSymbol} aún no se ha realizado. Por favor, ejecútala antes de usar el Node Builder.`)
    }else{
      await postExcuteNodeBuilder(data);
      localStorage.setItem("isRun", "Run"); // Empieza el polling al hacer click en "Ejecutar"
      setIsRunning(true)
      setNodes([])
      setNodesDown([])
      setNodesUp([])
    }
  };


 const startTest = async () => {
  try {
    const response = await postStartTest({ symbol: selectedSymbol, list_id: nodesTest });

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
    setNodesTest([])
  };

  return (
    <>
      {
      nodesTest.length > 0 && (() => {
        const nodosSelect = nodes.filter(node => nodesTest.includes(parseInt(node[0])));
        return (
          <div className="test-info">
            <span>Porcentaje de Acierto IS: {(nodosSelect.reduce((acc, node) => acc + parseFloat(node[4]), 0) / nodosSelect.length * 100).toFixed(2)}%</span>
            <span>Operaciones Acertadas IS: {nodosSelect.reduce((acc, node) => acc + node[5], 0)}</span>
            <span>Operaciones IS: {nodosSelect.reduce((acc, node) => acc + node[6], 0)}</span>
            <span>Porcentaje de Acierto OS: {(nodosSelect.reduce((acc, node) => acc + parseFloat(node[7]), 0) / nodosSelect.length * 100).toFixed(2)}%</span>
            <span>Operaciones Acertadas OS: {nodosSelect.reduce((acc, node) => acc + node[8], 0)}</span>
            <span>Operaciones OS: {nodosSelect.reduce((acc, node) => acc + node[9], 0)}</span>
          </div>
        );
      })()
    }
    <div className="node-wrapper">
      <div className="node-header">
        <div>
          <button onClick={() => navigate('/')}>Menú Principal</button>
          <button onClick={executeNode}>Ejecutar</button>
        </div>
        <span>{selectedSymbol}</span>
        <div>
          <button disabled={nodesTest.length === 0} style={{backgroundColor: nodesTest.length === 0 ? 'gray' : '#4CAF50'}} onClick={startTest}>Testear</button>
          <button disabled={!testRunning} style={{backgroundColor: testRunning ? '#4CAF50' : 'gray'}} onClick={stopTest}>Detener</button>
        </div>
      </div>
        <div className="container-node-container">
          <div className="container-node">
          {Array.isArray(nodesUp) &&
            nodesUp.map((node, index) => (
              node[1]==='END'
              ?<span key={index}></span>
              :<Nodo key={index} node={node} setNodesTest={setNodesTest} nodesTest={nodesTest}/>
            ))}
          </div>
          <div className="container-node">
            {Array.isArray(nodesDown) &&
              nodesDown.map((node, index) => (
                node[1]==='END'
                ?<span key={index}></span>
                :<Nodo key={index} node={node} setNodesTest={setNodesTest} nodesTest={nodesTest}/>
              ))}
          </div>
        </div>
       
      
      <div>
        {Array.isArray(nodes) && nodes.length > 0 && Array.isArray(nodes[nodes.length - 1]) && nodes[nodes.length - 1][1] === 'END' ? (
          <div className="node-footer">
          <h4 className="left">Nodos UP: {nodesUp.length}</h4>
          <h3 className="center">Terminado</h3>
          <h4 className="right">Nodos DOWN: {nodesDown.length}</h4>
        </div>
        ) :isRunning===true && symbolExtrac === selectedSymbol? (
          <div className="node-footer">
            <h4 className="left">Nodos UP: {nodesUp.length}</h4>
            <h3 className="center">Ejecutando...</h3>
            <h4 className="right">Nodos DOWN: {nodesDown.length}</h4>
          </div>
        ):(<></>)}
      </div>
      
    </div>
    </>
  );
};

export default NodeBuilder;
