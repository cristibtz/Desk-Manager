import React, { useEffect, useState } from "react";
import { fetchDesks } from "../../../utils/fetchData/fetchDesks";
import { fetchRooms } from "../../../utils/fetchData/fetchRooms";
import { getRoomAlias } from "../../../utils/mapRoomDesk";
import { filterByRoom } from "../../../utils/filterAndSort/filterByRoom";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";

function GetDesks({ token }) {
  const [desksData, setDesksData] = useState(null);
  const [roomFilter, setRoomFilter] = useState("all");
  const [roomsData, setRoomsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (token) {
      fetchDesks(token).then(setDesksData);
      fetchRooms(token).then(setRoomsData);
    }
  }, [token]);

  if (!desksData) {
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

  const handleRoomFilterChange = (e) => {
    setRoomFilter(e.target.value);
  }

  const filteredData = filterByRoom(desksData, roomFilter, roomsData);
  

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4">
        Desks
      </h2>
      <div className="px-4 mb-4 flex items-center">
        <label className="mr-2 text-white font-semibold">Filter by Room:</label>
        <select
          value={roomFilter}
          onChange={handleRoomFilterChange}
          className="p-2 border border-gray-300 rounded bg-white text-black"
        >
          <option value="all">All Rooms</option>
          {roomsData && roomsData.map((room) => (
            <option key={room.id} value={room.room_alias}>
              {room.room_alias}
            </option>
          ))}
        </select>
      </div>
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

export default GetDesks;