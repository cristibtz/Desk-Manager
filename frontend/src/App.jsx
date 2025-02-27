import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OccupiedDesks from './components/OccupiedDesks/OccupiedDesks';
import GetReservation from './components/UserComponents/GetReservation/GetReservation';
import NavBar from './components/NavBar/NavBar';
import AdminPanel from "./components/AdminPanel/AdminPanel"
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { KeycloakProvider } from './KeycloakContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        
        <Route path="/*" element={
          <KeycloakProvider>
            <NavBar />
            <Routes>
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="admin" element={
                <ProtectedRoute requiredRole={import.meta.env.VITE_REQUIRED_ROLE}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              
              <Route path="occupied" element={
                <ProtectedRoute>
                  <OccupiedDesks  />
                </ProtectedRoute>
              } />
              
              <Route path="user/reservations/:id" element={
                <ProtectedRoute>
                  <GetReservation />
                </ProtectedRoute>
              } />
            </Routes>
          </KeycloakProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;