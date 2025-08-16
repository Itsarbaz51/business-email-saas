import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ allowedRoles }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const { user, isLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user?.role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const normalizedRole = user?.role?.toUpperCase().replace(/\s+/g, "_");

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
