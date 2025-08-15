import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ roles }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const data = useSelector((state) => state.auth.data);
  console.log(".user?.role", data);

  const role = "admin"
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
