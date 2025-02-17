import React, {useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import CreateReservation from "../UserComponents/CreateReservation/CreateReservation";
import { createApiClient } from "../../utils/apiClient";
import { formatDate } from "../../utils/formatDate";
import "../../css/Table.css"

function Dashboard() {

    const { authenticated, token, logout } = useContext(KeycloakContext);
    const [userInfo, setData] = useState({ name: "", email: "", role: "" });
    const [reservationData, setReservationData] = useState([]);

    useEffect(() => {
        if (authenticated && token) {
          fetchData(token);
        }
    }, [authenticated, token]);

    const fetchData = async (token) => {

      const apiClient = createApiClient(token);
    
      const getUserInfo = await apiClient.get('/userinfo');
      console.log(getUserInfo.data);

      setData({
        name: getUserInfo.data.name,
        email: getUserInfo.data.email,
        role: getUserInfo.data.roles.includes("admin") ? "Admin" : "User"
      });

      const getReservations = await apiClient.get('/user/reservations');
      setReservationData(getReservations.data);
      
    };

  return (
    <div>
      <h1>Welcome, {userInfo.name} ({userInfo.role}) !</h1>

      <h2>Reservations</h2>
      
      <div className="table-container">
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

      <CreateReservation token={token} fetchData={fetchData} />

    </div>
  );
}

export default Dashboard;