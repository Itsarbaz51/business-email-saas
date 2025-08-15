import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ roles }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const role = useSelector((state) => state.auth);
  console.log(".user?.role", role);

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
