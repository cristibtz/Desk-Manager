import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OccupiedDesks from './components/OccupiedDesks/OccupiedDesks';
import GetReservation from './components/UserComponents/GetReservation/GetReservation';
import GetReservationAdmin from './components/AdminPanel/Reservations/GetReservationAdmin';
import GetUser from './components/AdminPanel/Users/GetUser';
import GetUserReservations from './components/AdminPanel/Users/GetUserReservations';
import GetRoom from './components/AdminPanel/Rooms/GetRoom';
import GetDesk from './components/AdminPanel/Desks/GetDesk';
import GetRoomDesks from './components/AdminPanel/Rooms/GetRoomDesks';

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
                <ProtectedRoute requiredRole={window.env.VITE_REQUIRED_ROLE}>
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

              <Route path="reservations/:id" element={
                <ProtectedRoute>
                  <GetReservationAdmin />
                </ProtectedRoute>
              } />

              <Route path="users/:id" element={
                <ProtectedRoute>
                  <GetUser />
                </ProtectedRoute>
              } />

              <Route path="users/:id/reservations" element={
                <ProtectedRoute>
                  <GetUserReservations />
                </ProtectedRoute>
              } />

              <Route path="rooms/:room_number" element={
                <ProtectedRoute>
                  <GetRoom />
                </ProtectedRoute>
              } />

              <Route path="desks/:id" element={
                <ProtectedRoute>
                  <GetDesk />
                </ProtectedRoute>
              } />

              <Route path="rooms/:id/desks" element={
                <ProtectedRoute>
                  <GetRoomDesks />
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