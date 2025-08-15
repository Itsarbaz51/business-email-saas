import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ roles }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // adjust to match your store structure
  const isLoading = useSelector((state) => state.auth.isLoading); // optional, if you track loading state

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  if (isLoading) {
    // Optional: show a loading spinner while checking user
    return <div>Loading...</div>;
  }

  if (!user || !user.role) {
    // Not logged in or role missing
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    // Role not authorizedadd
    console.warn("Access denied for role:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
