import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";


const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
      <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
      <Route path="/wishlist" element={user ? <WishlistPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;