import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "../../redux/slices/authSlice";

export default function RequireRole({ allowedRoles }) {
  const dispatch = useDispatch();
  const { currentUserData, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Refresh ke baad hamesha current user fetch karo
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Jab tak API call complete nahi hoti, kuch mat karo
  }

  console.log(currentUserData);
  

  // if (!currentUserData) {
  //   // Jab confirm ho jaye ki user nahi hai
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  const normalizedRole = currentUserData.role?.toUpperCase();

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
}
