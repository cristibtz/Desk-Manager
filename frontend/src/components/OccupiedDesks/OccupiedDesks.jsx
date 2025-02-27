import React, { useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import { createApiClient } from "../../utils/apiClient";
import { formatDate } from "../../utils/formatDate";
import { fetchDesks } from "../../utils/fetchData/fetchDesks";
import { fetchRooms } from "../../utils/fetchData/fetchRooms";
import { getDeskNumber, getRoomAlias } from "../../utils/mapRoomDesk";
import { filterByRoom } from "../../utils/filterAndSort/filterByRoom";
import { filterByDate } from "../../utils/filterAndSort/filterByDate";
import { sortByDate } from "../../utils/filterAndSort/sortByDate";
import Table from "../TableComponents/Table";
import TableCell from "../TableComponents/TableCell";
import Pagination from "../TableComponents/Pagination";

function OccupiedDesks() {
  const { authenticated, token } = useContext(KeycloakContext);
  const [occupied, setOccupiedData] = useState([]);
  const [desksData, setDesksData] = useState(null);
  const [roomsData, setRoomsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomFilter, setRoomFilter] = useState("all");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const rowsPerPage = 10;

  useEffect(() => {
    if (authenticated && token) {
      fetchOccupied(token);
      fetchDesks(token).then(setDesksData);
      fetchRooms(token).then(setRoomsData);
    }
  }, [authenticated, token]);

  const fetchOccupied = async (token) => {
    const apiClient = createApiClient(token);
    const occupiedDesks = await apiClient.get("/occupied");
    setOccupiedData(occupiedDesks.data);
  };

  if (!occupied || !desksData || !roomsData) {
    return <div>Loading...</div>;
  }

  const columns = ["Room Name", "Desk Number", "Start Date", "End Date"];

  const renderRow = (desk) => (
    <>
      <TableCell key="room">{getRoomAlias(desk.room_id, roomsData)}</TableCell>
      <TableCell key="desk">{getDeskNumber(desk.desk_id, desksData)}</TableCell>
      <TableCell key="start">{formatDate(desk.start_date)}</TableCell>
      <TableCell key="end">{formatDate(desk.end_date)}</TableCell>
    </>
  );

  const handleRoomFilterChange = (e) => {
    setRoomFilter(e.target.value);
  };

  const handleStartDateFilterChange = (e) => {
    setStartDateFilter(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredData = filterByRoom(occupied, roomFilter, roomsData);
  const filteredByDateData = filterByDate(filteredData, startDateFilter);
  const sortedData = sortByDate(filteredByDateData, sortOrder, "start_date");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="bg-[#f37f0c] min-h-screen">
      <h1 className="text-2xl font-bold text-white underline p-4">
        Occupied Desks
      </h1>
      <div className="px-4 mb-4 flex items-center">
        <label className="mr-2 text-white font-semibold">Filter by Room:</label>
        <select
          value={roomFilter}
          onChange={handleRoomFilterChange}
          className="p-2 border border-gray-300 rounded bg-white text-black"
        >
          <option value="all">All Rooms</option>
          {roomsData.map((room) => (
            <option key={room.id} value={room.room_alias}>
              {room.room_alias}
            </option>
          ))}
        </select>
      </div>
      <div className="px-4 mb-4 flex items-center">
        <label className="mr-2 text-white font-semibold">Filter by Start Date:</label>
        <input
          type="date"
          value={startDateFilter}
          onChange={handleStartDateFilterChange}
          className="p-2 border border-gray-300 rounded bg-white text-black"
        />
      </div>
      <div className="px-4 mb-4 flex items-center">
        <label className="mr-2 text-white font-semibold">Sort by Start Date:</label>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="p-2 border border-gray-300 rounded bg-white text-black"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="table-container">
        <Table columns={columns} data={currentData} renderRow={renderRow} />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default OccupiedDesks;