import React, { useEffect, useState } from "react";
import { formatDate } from "../../../utils/formatDate";
import { fetchReservations } from "../../../utils/fetchReservations";
import { getDeskNumber, getRoomAlias } from "../../../utils/mapRoomDesk";
import "../../../css/Table.css";

function GetReservations({ token, roomsData, desksData })  {
  const [reservationsData, setReservationsData] = useState(null);
  
  useEffect(() => {
    if (token) {
      fetchReservations(token).then(setReservationsData);
    }
  }, [token]);

  if(!reservationsData) {
    return <div>Reservations not found</div>
}

  if(!reservationsData || !desksData || !roomsData) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4">
        Reservations
      </h2>

      <div className="table-container">
        {reservationsData.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Room ID</th>
                <th>Desk Number</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {reservationsData.map((reservation) => (
                <tr key={reservation.id}>
                  <td><a href={`/user/reservations/${reservation.id}`}>{reservation.id}</a></td>
                  <td>{getRoomAlias(reservation.room_id, roomsData)}</td>
                  <td>{getDeskNumber(reservation.desk_id, desksData)}</td>
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