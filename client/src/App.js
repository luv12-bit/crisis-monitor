import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar         from './components/Navbar';
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import RegionDetail   from './pages/RegionDetail';
import About          from './pages/About';
import AlertsPage     from './pages/AlertsPage';
import MLPage         from './pages/MLPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"       element={<Landing />}  />
        <Route path="/login"  element={<Login />}    />
        <Route path="/about"  element={<About />}    />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/alerts"    element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/ml"        element={<ProtectedRoute><MLPage /></ProtectedRoute>} />
        <Route path="/region/:countryCode" element={<ProtectedRoute><RegionDetail /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;