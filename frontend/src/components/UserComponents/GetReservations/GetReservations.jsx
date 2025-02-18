import React, { useEffect, useState, useContext } from "react";
import { KeycloakContext } from "../../../KeycloakContext";
import { formatDate } from "../../../utils/formatDate";
import { fetchReservations } from "../../../utils/fetchReservations";
import "../../../css/Table.css";

function GetReservations()  {
  const { token } = useContext(KeycloakContext);
  const [reservationsData, setReservationsData] = useState(null);

  useEffect(() => {
    if (token) {
      fetchReservations(token).then(setReservationsData);
    }
  }, [token]);

  if(!reservationsData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Reservations</h2>

      <div className="table-container">
        {reservationsData.length > 0 ? (
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
              {reservationsData.map((reservation) => (
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
    </div>
  );
};

export default GetReservations;