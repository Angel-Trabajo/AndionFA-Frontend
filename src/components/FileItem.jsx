import logo from '/ico_config_file.png'
import '../styles/FileItem.css';

const FileItem = ({ file, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(file)}
      className={`file-item ${isSelected ? 'selected' : ''}`}
    >
      <img src={logo} alt="icon" className="file-icon" />
      <span>{file}</span>
    </div>
  );
};

export default FileItem;
