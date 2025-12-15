import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import UserOrders from './pages/UserOrders';
import AboutUs from './pages/AboutUs';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import SingleProduct from './components/SingleProduct';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import { useEffect } from 'react';

function AnalyticsRouter() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-0D31ZC0M9B';
    if (!measurementId || !window.gtag) return;

    window.gtag('config', measurementId, {
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/getstarted" element={<GetStarted />} />
      <Route path="/home" element={<Home />} />
      <Route path="/my-orders" element={<UserOrders />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failure" element={<PaymentFailure />} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AnalyticsRouter />
    </Router>
  );
}

export default App;