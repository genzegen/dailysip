import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GetStarted from './pages/GetStarted';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;