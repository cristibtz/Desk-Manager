import React, { useEffect, useState } from "react";
import { initKeycloak, logout} from "../../Keycloak"
import axios from "axios";
import './Dashboard.css';
import { formatDate } from "../../utils/formatDate";

function Dashboard() {

  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setData] = useState({ name: "", email: "", role: "" });
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {

    const initializeKeycloak = async () => {

      const {authenticated, token}  = await initKeycloak();
      console.log(token);
      setAuthenticated(authenticated);

      if (authenticated) {
        fetchData(token);
      }

    };

    const fetchData = async (token) => {

      const apiClient = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    
      const getUserInfo = await apiClient.get('/userinfo');
      console.log(getUserInfo.data);
      setData({
        name: getUserInfo.data.name,
        email: getUserInfo.data.email,
        role: getUserInfo.data.roles.includes("admin") ? "Admin" : "User"
      });

      const getReservations = await apiClient.get('/user/reservations');
      console.log(getReservations.data);
      setReservationData(getReservations.data);
      
    };
    initializeKeycloak();

  }, []);

  return (
    <div>
      <p>Name: {userInfo.name}</p>
      <p>Email: {userInfo.email}</p>
      <p>Role: {userInfo.role}</p>
      {authenticated && <button onClick={logout}>Logout</button>}

      <h2>Reservations</h2>
      <p>Here are your reservations:</p>
      
      {reservationData.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Room ID</th>
              <th>Desk ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {reservationData.map((reservation) => (
              <tr key={reservation.id}>
                <td><a href={`/user/reservations/${reservation.id}`}>{reservation.id}</a></td>
                <td>{reservation.room_id}</td>
                <td>{reservation.desk_id}</td>
                <td>{formatDate(reservation.start_date)}</td>
                <td>{formatDate(reservation.end_date)}</td>
                <td>{reservation.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}
    
    </div>
  );
}

export default Dashboard;