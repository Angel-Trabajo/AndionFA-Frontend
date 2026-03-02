import FastApi from "../apis/FastApi";

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



export const executeAlgorithm = async () => {
  try {
    const response = await FastApi.post('/config/execute-algorithm');
    return response.data;
  } catch (error) {
    console.error("Error sending indicators request:", error);
    throw error;
  }
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