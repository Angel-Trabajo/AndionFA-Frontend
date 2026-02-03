import '../styles/Nodo.css'

const Nodo = ({node, setNodesTest, nodesTest, future}) => {

  const handleClick = () => {
    if(future === 'no'){
        setNodesTest(prev =>
        prev.includes(node[0])
          ? prev.filter(id => id !== node[0])
          : [...prev, node[0]]
        )
    }else{
      setNodesTest([node[0]])
    }
   
  }

  return (
    <div
      className="node-card"
      onClick={handleClick}
      style={{
        backgroundColor: nodesTest.includes(node[0]) ? '#9dd' : '#efefef'
      }}
    >
        <span>Operación: {node[1]}</span>
        <span>Porcentaje de Acierto IS: {parseFloat(node[4]*100).toFixed(2)}%</span>
        <span>Operaciones Acertadas IS: {node[5]}</span>
        <span>Operaciones IS: {node[6]}</span>
        <span>Porcentaje de Acierto OS: {parseFloat(node[7]).toFixed(2)}%</span>
        <span>Operaciones Acertadas OS: {node[8]}</span>
        <span>Operaciones OS: {node[9]}</span>
    </div>
  )
}

export default Nodo