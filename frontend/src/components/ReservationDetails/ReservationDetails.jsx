import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../KeycloakContext";
import { createApiClient } from "../../utils/apiClient";
import { formatDate } from "../../utils/formatDate";
import "../../css/Table.css"; 

function ReservationDetails() {
    const { id } = useParams();
    const { authenticated, token } = useContext(KeycloakContext);
    const [reservation, setReservation] = useState(null);

    useEffect(() => {
        if (authenticated && token) {
            fetchReservation(token, id);
        }
    }, [authenticated, token, id]);

    const fetchReservation = async (token, id) => {
        const apiClient = createApiClient(token);
        const reservationData = await apiClient.get(`/user/reservations/${id}`);
        console.log(reservationData.data);
        setReservation(reservationData.data);
    };

    if(!reservation){
        return <div>Loading...</div>;
    }

    return (
        <div className="table-container">
            <h1>Reservation Details</h1>
            {reservation ? (
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
                        <tr>
                            <td>{reservation.id}</td>
                            <td>{reservation.room_id}</td>
                            <td>{reservation.desk_id}</td>
                            <td>{formatDate(reservation.start_date)}</td>
                            <td>{formatDate(reservation.end_date)}</td>
                            <td>{reservation.note}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No reservation found.</p>
            )}
        </div>
    );
}

export default ReservationDetails;