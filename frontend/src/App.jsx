import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
// import GettingStarted from './pages/GettingStarted';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/getting-started" element={<GettingStarted />} /> */}
      </Routes>
    </Router>
  );
}

export default App;