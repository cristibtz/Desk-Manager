import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import OccupiedDesks from './components/OccupiedDesks/OccupiedDesks';
import ReservationDetails from './components/ReservationDetails/ReservationDetails';
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
            <ProtectedRoute requiredRole="Admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/occupied" element={<OccupiedDesks />}></Route>
          <Route path="/user/reservations/:id" element={ <ReservationDetails />} />
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}

export default App;