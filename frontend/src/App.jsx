import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import NavBar from './components/NavBar/NavBar';
import AdminPanel from "./components/AdminPanel/AdminPanel"
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { KeycloakProvider } from './KeycloakContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;