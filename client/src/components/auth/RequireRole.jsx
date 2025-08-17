import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ allowedRoles }) {
  const dispatch = useDispatch();
  const { currentUserData, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // API call hone tak wait kar
  }

  if (!isLoading == false && !currentUserData.role == "ADMIN") {
    // Sirf tabhi redirect karo jab confirm ho jaye user null hai
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  const normalizedRole = currentUserData?.role?.toUpperCase();

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
