import { createContext, useContext, useState } from "react";

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const Timeframes = ['M1', 'M5', 'M15', 'M30','H1', 'H2', 'H3', 'H4', 'D1'];
  const [selectedTimeframe, setSelectedTimeframe] = useState(Timeframes[0])
  const [startDate, setStartDate] = useState('2017-01-01')
  const [endDate, setEndDate] = useState('2021-01-01')
  const [dataConfig, setdataConfig] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  return (
    <ConfigContext.Provider value={{ selectedFiles, 
    setSelectedFiles, 
    selectedSymbol, 
    setSelectedSymbol, 
    Timeframes, 
    selectedTimeframe, 
    setSelectedTimeframe, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate,
    dataConfig,
    setdataConfig,
    isRunning,
    setIsRunning }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);