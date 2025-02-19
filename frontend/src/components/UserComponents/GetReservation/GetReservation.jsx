import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchDesks } from "../../../utils/fetchDesks";
import { fetchRooms } from "../../../utils/fetchRooms";
import { formatDate } from "../../../utils/formatDate";
import { getDeskNumber, getRoomAlias } from "../../../utils/mapRoomDesk";
import { fetchReservation } from "../../../utils/fetchReservation";

import "../../../css/Table.css"; 

function GetReservation() {
    const { id } = useParams();
    const { authenticated, token } = useContext(KeycloakContext);
    const [reservationData, setReservationData] = useState(null);
    const [desksData, setDesksData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);

    useEffect(() => {
        if (authenticated && token) {
            fetchReservation(token, id).then(setReservationData);
            fetchDesks(token).then(setDesksData);
            fetchRooms(token).then(setRoomsData);
        }
    }, [authenticated, token, id]);
    
    if(!reservationData) {
        return <div>Reservation not found</div>
    }

    if(!reservationData || !desksData || !roomsData) {
        return <div>Loading...</div>
    }

    return (
        <div className="table-container">
            <h1>Reservation Details</h1>
            {reservationData ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Reservation ID</th>
                            <th>Room Name</th>
                            <th>Desk Number</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{reservationData.id}</td>
                            <td>{getRoomAlias(reservationData.room_id, roomsData)}</td>
                            <td>{getDeskNumber(reservationData.desk_id, desksData)}</td>
                            <td>{formatDate(reservationData.start_date)}</td>
                            <td>{formatDate(reservationData.end_date)}</td>
                            <td>{reservationData.note}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No reservation found.</p>
            )}
        </div>
    );
}

export default GetReservation;