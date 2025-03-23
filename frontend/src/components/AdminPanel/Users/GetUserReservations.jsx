import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchDesks } from "../../../utils/fetchData/fetchDesks";
import { fetchRooms } from "../../../utils/fetchData/fetchRooms";
import { formatDate } from "../../../utils/formatDate";
import { filterByRoom } from "../../../utils/filterAndSort/filterByRoom";
import { filterByDate } from "../../../utils/filterAndSort/filterByDate";
import { sortByDate } from "../../../utils/filterAndSort/sortByDate";
import { getDeskNumber, getRoomAlias } from "../../../utils/mapRoomDesk";
import { fetchUserReservationsAdmin } from "../../../utils/fetchData/AdminData/fetchUserReservationsAdmin";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";


function GetUserReservations() {
    const { id } = useParams();
    const { authenticated, token } = useContext(KeycloakContext);
    const [reservationsData, setReservationsData] = useState(null);
    const [desksData, setDesksData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);
    const [roomFilter, setRoomFilter] = useState("all");
    const [startDateFilter, setStartDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        if (authenticated && token) {
            fetchUserReservationsAdmin(token, id).then(setReservationsData);
            fetchDesks(token).then(setDesksData);
            fetchRooms(token).then(setRoomsData);
        }
    }, [authenticated, token, id]);
    
    if (!reservationsData) {
        return <div>Reservations not found</div>;
    }
    
    if (!reservationsData || !desksData || !roomsData) {
        return <div>Loading...</div>;
    }

    const columns = ["Reservation ID", "User ID", "Room Name", "Desk Number", "Start Date", "End Date", "Note"];

    const renderRow = (reservation) => (
        <>
          <TableCell>
            <a href={`/reservations/${reservation.id}`}>{reservation.id}</a>
          </TableCell>
          <TableCell>
            <a href={`/users/${reservation.user_id}`}>{reservation.user_id}</a>
          </TableCell>
          <TableCell>{getRoomAlias(reservation.room_id, roomsData)}</TableCell>
          <TableCell>{getDeskNumber(reservation.desk_id, desksData)}</TableCell>
          <TableCell>{formatDate(reservation.start_date)}</TableCell>
          <TableCell>{formatDate(reservation.end_date)}</TableCell>
          <TableCell>{reservation.note}</TableCell>
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
    
      const filteredData = filterByRoom(reservationsData, roomFilter, roomsData);
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
        <div className="min-h-screen bg-[#f37f0c]">
          <h2 className="text-2xl font-bold text-white underline p-4">
            User Reservations
          </h2>
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

export default GetUserReservations;