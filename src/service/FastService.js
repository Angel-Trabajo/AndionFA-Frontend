import FastApi from "../apis/FastApi";

const BASE_URL = import.meta.env.VITE_FAST_API || "http://localhost:8000";

export const startEngine = async () => {
  const response = await FastApi.post('/engine/start');
  return response.data;
};

export const stopEngine = async (mode = "graceful") => {
  const response = await FastApi.post('/engine/stop', { mode });
  return response.data;
};

export const getEngineStatus = async () => {
  const response = await FastApi.get('/engine/status');
  return response.data;
};

export const getLiveConfig = async () => {
  const response = await FastApi.get('/engine/live-config');
  return response.data;
};

export const saveLiveConfig = async (data) => {
  const response = await FastApi.post('/engine/live-config', data);
  return response.data;
};

export const applyLiveFilter = async () => {
  const response = await FastApi.post('/engine/apply-filter');
  return response.data;
};

export const updateEngineLotSize = async (engineId, lotSize) => {
  const response = await FastApi.post(`/engine/engine/${encodeURIComponent(engineId)}/lot-size`, {
    lot_size: lotSize,
  });
  return response.data;
};

export const stopSingleEngine = async (engineId, mode = "graceful") => {
  const response = await FastApi.post(`/engine/engine/${encodeURIComponent(engineId)}/stop`, { mode });
  return response.data;
};

export const getLiveStats = async () => {
  const response = await FastApi.get('/engine/stats');
  return response.data;
};

export const getNodes = async (params = {}) => {
  const response = await FastApi.get('/config/nodes', { params });
  return response.data;
};

export const listBackups = async () => {
  const response = await FastApi.get('/config/backup/list');
  return response.data;
};

export const createBackup = async () => {
  const response = await FastApi.post('/config/backup/create');
  return response.data;
};

export const restoreBackup = async (file) => {
  const response = await FastApi.post('/config/backup/restore', null, { params: { file } });
  return response.data;
};

export const getBackupDownloadUrl = (file) =>
  `${BASE_URL}/config/backup/download/${encodeURIComponent(file)}`;

export const getBacktestList = async () => {
  const response = await FastApi.get('/config/backtest/list');
  return response.data;
};

export const getBacktestEquity = async (symbol, mercado, algo) => {
  const response = await FastApi.get('/config/backtest/equity', {
    params: { symbol, mercado, algo },
  });
  return response.data;
};

export const runBacktest = async () => {
  const response = await FastApi.post('/config/backtest/run');
  return response.data;
};

export const getBacktestRunStatus = async () => {
  const response = await FastApi.get('/config/backtest/run/status');
  return response.data;
};

export const getBacktestConfig = async () => {
  const response = await FastApi.get('/config/backtest/config');
  return response.data;
};

export const saveBacktestConfig = async (date_start, date_end) => {
  const response = await FastApi.post('/config/backtest/config', { date_start, date_end });
  return response.data;
};

export const getBacktestEquityAll = async () => {
  const response = await FastApi.get('/config/backtest/equity-all');
  return response.data;
};

export const getMt5Status = async () => {
  const response = await FastApi.get('/engine/mt5-status');
  return response.data;
};

export const getExecutorFiles = async () => {
  try {
    const response = await FastApi.get('/config/extractor-files');
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const postExtractorFiles = async (data) => {
  try {
    const response = await FastApi.post('/config/extractor-files', data);
    return response.data;
  } catch (error) {
    console.error("Error executing extractor:", error);
    throw error;
  }
};

export const getListSymbol = async () => {
  try {
    const response = await FastApi.get('/config/list-symbol');
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const getGeneralConfig = async () =>{
  try{
    const response = await FastApi.get('/config/general-config')
    return response.data
  }catch (error) {
    console.error("Error sending indicators request:", error);
    throw error;
  }
}

export const postGeneralConfig = async (data) =>{
  try{
    const response = await FastApi.post('/config/general-config', data)
    return response.data
  }catch (error) {
    console.error("Error sending indicators request:", error); 
    throw error;
  }
}



export const executeAlgorithm = async (resetDb = false) => {
  try {
    const response = await FastApi.post('/config/execute-algorithm', { reset_db: resetDb });
    return response.data;
  } catch (error) {
    console.error("Error sending indicators request:", error);
    throw error;
  }
}

export const stopAlgorithm = async () => {
  const response = await FastApi.post('/config/execute-stop');
  return response.data;
}

export const getExecuteProgress = async () => {
  const response = await FastApi.get('/config/execute-progress');
  return response.data;
}


// export const postExcuteNodeBuilder = async (data)=>{
//   try{
//     const response = await FastApi.post('/config/execute-node-builder', data)
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }

// export const getNodes = async (data)=>{
//   try{
//     const response = await FastApi.get('/config/nodos', {params: data})
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }

// export const getSymbolExtrac = async () =>{
//   try{
//     const response = await FastApi.get('/config/symbol-extrac')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error);
//     throw error;
//   }
// }

// export const postStartTest = async (data)=>{
//   try{
//     const response = await FastApi.post('/config/start-test', data)
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }

// export const postStopTest = async ()=>{
//   try{
//     const response = await FastApi.post('/config/stop-test')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }


// export const getConfigCrossing = async () =>{
//   try{
//     const response = await FastApi.get('/config/get-crossing-config')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error);
//     throw error;
//   }
// }

// export const postConfigCrossing = async (data) =>{
//   try{
//     const response = await FastApi.post('/config/set-crossing-config', data)
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error);
//     throw error;
//   }
// }

// export const getCrossingDbs = async () =>{
//   try{
//     const respose = await FastApi.get('/config/crossing-dbs')
//     return respose.data
//   }catch (error){
//     console.error("Error sending indicators request:", error);
//     throw error;
//   }
// }


// export const getNodesCrossind = async (data)=>{
//   try{
//     const response = await FastApi.get(`/config/nodos-db-crossing/${data}`)
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }


// export const postStartCrossing = async ()=>{
//   try{
//     const response = await FastApi.post('/config/execute-crossing')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }

// export const postStopCrossing = async ()=>{
//   try{
//     const response = await FastApi.post('/config/stop-crossing')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }



// export const getPrincipalSymbol = async (data)=>{
//   try{
//     const response = await FastApi.get('/config/get-principal-symbol')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }


// export const postStartTestCross = async (data)=>{
//   try{
//     const response = await FastApi.post('/config/start-test-cross', data)
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }

// export const getCrossingState = async () =>{
//   try{
//     const response = await FastApi.get('/config/get-state-crossing')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error);
//     throw error;
//   }
// }



// export const postStartNeuronalRed = async ()=>{
//   try{
//     const response = await FastApi.post('/config/execute-neuronal-red')
//     return response.data
//   }catch (error) {
//     console.error("Error sending indicators request:", error); 
//     throw error;
//   }
// }