import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ roles }) {
  const role = useSelector((state) => state.auth.user?.role);

  console.log("RequireRole - role:", role);

  if (role === undefined || role === null) {
    return <div>Loading...</div>;
  }

  if (!roles.includes(role)) {
    console.warn("Access denied for role:", role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
