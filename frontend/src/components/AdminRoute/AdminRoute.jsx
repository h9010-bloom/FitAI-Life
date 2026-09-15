import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const adminAccess = localStorage.getItem("adminAccess");

  if (adminAccess !== "true") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;