import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { fetchRoomDesks } from "../../../utils/fetchData/AdminData/fetchRoomDesks";
import { getRoomAlias } from "../../../utils/mapRoomDesk";
import { fetchRooms } from "../../../utils/fetchData/AdminData/fetchRooms";
import { KeycloakContext } from "../../../KeycloakContext";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";

function GetRoomDesks() {
    const { authenticated, token } = useContext(KeycloakContext);
    const [roomDesksData, setRoomDesksData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { id } = useParams();
    const rowsPerPage = 10;

    useEffect(() => {
        if (authenticated && token) {
            fetchRoomDesks(token, id).then(setRoomDesksData);
            fetchRooms(token).then(setRoomsData);
        }
    }, [authenticated, token, id]);

    if (!roomDesksData) {
        return <p className="text-center text-white">No desks found.</p>;
    }
    const columns = ["Desk ID", "Desk Number", "Room Name"];

    const renderRow = (desk) => (
        <>
            <TableCell>
            <a href={`/desks/${desk.id}`}>{desk.id}</a>
            </TableCell>
            <TableCell>{desk.desk_number}</TableCell>
            <TableCell>{getRoomAlias(desk.room_id, roomsData)}</TableCell>
        </>
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(roomDesksData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentData = roomDesksData.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-[#f37f0c]">
            <h2 className="text-2xl font-bold text-white underline p-4">
                Desks
            </h2>
            <div className="table-container">
                <Table columns={columns} data={currentData} renderRow={renderRow} />
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default GetRoomDesks;