import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Instagram from './components/Instagram';
import GetStarted from './pages/GetStarted';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/getstarted" element={<GetStarted />} />
      </Routes>
    </Router>
  );
}

export default App;