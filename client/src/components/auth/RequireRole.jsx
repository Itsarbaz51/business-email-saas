import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ roles }) {
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch if we don't have a user yet
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const role = user?.role;

  console.log(".user?.role", role);
  console.log("RequireRole - role:", role);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!role) {
    // Not logged in or role missing
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(role)) {
    console.warn("Access denied for role:", role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
