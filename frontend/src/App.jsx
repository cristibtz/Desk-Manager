import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import OccupiedDesks from './components/OccupiedDesks/OccupiedDesks';
import GetReservation from './components/UserComponents/GetReservation/GetReservation';
import NavBar from './components/NavBar/NavBar';
import AdminPanel from "./components/AdminPanel/AdminPanel"
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { KeycloakProvider } from './KeycloakContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./css/App.css";

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole={import.meta.env.VITE_REQUIRED_ROLE}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/occupied" element={<OccupiedDesks />}></Route>
          <Route path="/user/reservations/:id" element={ <GetReservation />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;