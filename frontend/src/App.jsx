import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import SingleProduct from './components/SingleProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;