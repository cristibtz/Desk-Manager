import React, { useEffect, useState } from "react";
import { fetchRooms } from "../../../utils/fetchData/AdminData/fetchRooms";
import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";

function GetRooms({ token }) {
  const [roomsData, setRoomsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (token) {
      fetchRooms(token).then(setRoomsData);
    }
  }, [token]);

  if (!roomsData) {
    return <p className="text-center text-white">No rooms found.</p>;
  }
  const columns = ["Room ID", "Room Name", "Room Number", "View Desks"];

  const renderRow = (room) => (
    <>
        <TableCell>
          <a href={`/rooms/${room.id}`}>{room.id}</a>
        </TableCell>
        <TableCell>{room.room_alias}</TableCell>
        <TableCell>{room.room_number}</TableCell>
        <TableCell>
          <a href={`/rooms/${room.id}/desks`}>View Desks</a>
        </TableCell>
        
    </>
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(roomsData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = roomsData.slice(startIndex, endIndex);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4">
        Rooms
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

export default GetRooms;