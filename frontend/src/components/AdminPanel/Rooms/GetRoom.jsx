import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchRoom } from "../../../utils/fetchData/AdminData/fetchRoom";
import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";

function GetRoom() {
    const { token } = useContext(KeycloakContext);
    const [roomData, setRoomData] = useState(null);
    const { room_number } = useParams();

    useEffect(() => {
        if (token, room_number) {
        fetchRoom(token, room_number).then(setRoomData);
        }
    }, [token]);

    if (!roomData) {
        return <p className="text-center text-white">No room found.</p>;
    }
    const columns = ["Room ID", "Room Name", "Room Number", "View Desks"];

    const renderRow = (room) => (
        <>
            <TableCell> {room.id}</TableCell>
            <TableCell>{room.room_alias}</TableCell>
            <TableCell>{room.room_number}</TableCell>
            <TableCell>
                <a href={`/rooms/${room.id}/desks`}>View Desks</a>
            </TableCell>
        </>
    );

    return (
        <div className="min-h-screen bg-[#f37f0c]">
            <h2 className="text-2xl font-bold text-white underline p-4">
                Room
            </h2>
            <div className="table-container">
                <Table columns={columns} data={[roomData]} renderRow={renderRow} />
            </div>
        </div>
    );
}

export default GetRoom;