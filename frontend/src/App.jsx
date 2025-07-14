import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
// import GettingStarted from './pages/GettingStarted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/header" element={<Header />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/getting-started" element={<GettingStarted />} /> */}
      </Routes>
    </Router>
  );
}

export default App;