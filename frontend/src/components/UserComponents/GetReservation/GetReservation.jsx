import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchDesks } from "../../../utils/fetchData/fetchDesks";
import { fetchRooms } from "../../../utils/fetchData/fetchRooms";
import { formatDate } from "../../../utils/formatDate";
import { getDeskNumber, getRoomAlias } from "../../../utils/mapRoomDesk";
import { fetchReservation } from "../../../utils/fetchData/fetchReservation";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";

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
    
    if (!reservationData) {
        return <div>Reservation not found</div>;
    }

    if (!reservationData || !desksData || !roomsData) {
        return <div>Loading...</div>;
    }

    const columns = ["Reservation ID", "Room Name", "Desk Number", "Start Date", "End Date", "Note"];

    const renderRow = (reservation) => (
        <>
            <TableCell>{reservation.id}</TableCell>
            <TableCell>{getRoomAlias(reservation.room_id, roomsData)}</TableCell>
            <TableCell>{getDeskNumber(reservation.desk_id, desksData)}</TableCell>
            <TableCell>{formatDate(reservation.start_date)}</TableCell>
            <TableCell>{formatDate(reservation.end_date)}</TableCell>
            <TableCell>{reservation.note}</TableCell>
        </>
    );

    return (
        <div className="min-h-screen bg-[#f37f0c]">
            <h1 className="text-2xl font-bold text-white underline p-4">
                Reservation Details
            </h1>
            <Table columns={columns} data={[reservationData]} renderRow={renderRow} />
        </div>
    );
}

export default GetReservation;