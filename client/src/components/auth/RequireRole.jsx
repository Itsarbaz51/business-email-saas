import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ roles }) {
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.role) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    console.warn("Access denied for role:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
