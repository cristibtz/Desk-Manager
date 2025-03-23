import React, { useEffect, useState } from "react";
import { fetchDesks } from "../../../utils/fetchData/AdminData/fetchDesks";
import { fetchRooms } from "../../../utils/fetchData/AdminData/fetchRooms";
import { getRoomAlias } from "../../../utils/mapRoomDesk";

import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";

function GetDesks({ token }) {
  const [desksData, setDesksData] = useState(null);
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(desksData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = desksData.slice(startIndex, endIndex);

  return (
    <div>
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

export default GetDesks;