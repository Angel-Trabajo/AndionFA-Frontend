import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        {children}
      </div>
    </div>
  );
};

export default Layout;
