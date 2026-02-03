import { useState, useEffect } from 'react'
import { getListSymbol } from '../service/FastService'
import { useConfig } from '../context/ConfigContext'
import '../styles/SelectConfig.css'

const SelectConfig = () => {
  const [symbols, setSymbols] = useState([])
  const { selectedSymbol, setSelectedSymbol } = useConfig()
  const { Timeframes, selectedTimeframe, setSelectedTimeframe } = useConfig()
  const { startDate, setStartDate } = useConfig()
  const { endDate, setEndDate } = useConfig()

  useEffect(() => {
    const fetchSymbols = async () => {
      const data = await getListSymbol()
      setSymbols(data.symbols || [])
    }
    fetchSymbols()
  }, [])

  useEffect(() => {
    if (symbols.length > 0 && selectedSymbol === '') {
      setSelectedSymbol(symbols[0])
    }
  }, [symbols, selectedSymbol])

 
  return (
  <div className="select-config-container">
    <h2>Select Configuration</h2>

    <div>
      <select
        name="config"
        id="config"
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
      >
        {symbols.map((symbol, index) => (
         
            <option key={index} value={symbol}>
              {symbol}
            </option> 
        ))}
      </select>
    </div>

    <div>
      <select
        name="timeframe"
        id="timeframe"
        value={selectedTimeframe}
        onChange={(e) => setSelectedTimeframe(e.target.value)}
      >
        {Timeframes.map((timeframe, index) => (
          <option key={index} value={timeframe}>
            {timeframe}
          </option>
        ))}
      </select>
    </div>

    <div className="date-range">
      <label>
        Fecha de inicio:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <label>
        Fecha final:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
    </div>
  </div>
)
}

export default SelectConfig
