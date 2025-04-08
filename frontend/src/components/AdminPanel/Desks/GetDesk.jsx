import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchDesk } from "../../../utils/fetchData/AdminData/fetchDesk";
import { fetchRooms } from "../../../utils/fetchData/fetchRooms";
import { getRoomAlias } from "../../../utils/mapRoomDesk";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";

function GetDesk() {
    const { token } = useContext(KeycloakContext);
    const [deskData, setDeskData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (token, id) {
            fetchDesk(token, id).then(setDeskData);
            fetchRooms(token).then(setRoomsData);
        }
    }, [token]);

    if (!deskData) {
        return <p className="text-center text-white">No desk found.</p>;
    }
    const columns = ["Desk ID", "Desk Number", "Room Name"];

    const renderRow = (desk) => (
        <>
            <TableCell> {desk.id}</TableCell>
            <TableCell>{desk.desk_number}</TableCell>
            <TableCell>{getRoomAlias(desk.id, roomsData)}</TableCell>

        </>
    );

    return (
        <div className="min-h-screen bg-[#f37f0c]">
            <h2 className="text-2xl font-bold text-white underline p-4">
                Desk
            </h2>
            <div className="table-container">
                <Table columns={columns} data={[deskData]} renderRow={renderRow} />
            </div>
        </div>
    );
}

export default GetDesk;