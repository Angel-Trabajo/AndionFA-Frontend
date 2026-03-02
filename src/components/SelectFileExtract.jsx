// src/components/SelectFileExtract.jsx
import { useState, useEffect } from 'react';
import { getExecutorFiles } from '../service/FastService';
import { postExtractorFiles } from '../service/FastService';
import FileItem from './FileItem';
import { useConfig } from '../context/ConfigContext';
import '../styles/SelectFileExtract.css';


const SelectFileExtract = () => {
  const [files, setFiles] = useState([]);
  const { selectedFiles, setSelectedFiles } = useConfig();
  const [isSelectedAll, setIsSelectedAll] = useState(false);


  useEffect(() => {
    const fetchFiles = async () => {
      const data = await getExecutorFiles();
      setFiles(data.list_files || []);
    };
    fetchFiles();
  }, []);

  const toggleSelectFile = (file) => {
    setSelectedFiles((prev) =>
      prev.includes(file)
        ? prev.filter((f) => f !== file)
        : [...prev, file]
    );
  };

  const selectAll = () => {
    if (isSelectedAll) {
      setSelectedFiles([]);
      setIsSelectedAll(false);
    }else {
      setSelectedFiles(files);
      setIsSelectedAll(true);
    }
    
  };

  const sendFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo para extraer');
      return;
    }
    try {
      await postExtractorFiles(selectedFiles);
      setSelectedFiles([]);
      alert('Archivos seleccionados enviados para extracción');
    } catch (error) {
      console.error("Error sending files:", error);
    }
  };

  return (
    <div className="select-file-card">
      <h2 className="title">Seleccionar Archivos</h2>

      <div className="file-list">
        {files.map((file, index) => (
          <FileItem
            key={index}
            file={file}
            isSelected={selectedFiles.includes(file)}
            onClick={toggleSelectFile}
          />
        ))}
      </div>

      <div className="footer">
        <button className="btn" onClick={selectAll}>Seleccionar todos</button>
        <span>{selectedFiles.length} selecc</span>
      </div>
      <div>
        <button className="btn" onClick={sendFiles}>Extraer</button>
      </div>
    </div>
  );
};

export default SelectFileExtract;
