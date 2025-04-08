import React, { useEffect, useState } from "react";
import { fetchUsers } from "../../../utils/fetchData/AdminData/fetchUsers";
import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";
import Pagination from "../../TableComponents/Pagination";

function GetUsers({ token }) {
  const [usersData, setUsersData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (token) {
      fetchUsers(token).then(setUsersData);
    }
  }, [token]);

  if (!usersData) {
    return <p className="text-center text-white">No users found.</p>;
  }
  const columns = ["User ID", "Username", "Email", "Reservations"];

  const renderRow = (user) => (
    <>
        <TableCell>
          <a href={`/users/${user.id}`}>{user.id}</a>
        </TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <a href={`/users/${user.id}/reservations`}>View Reservations</a>
        </TableCell>
    </>
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(usersData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = usersData.slice(startIndex, endIndex);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white underline p-4">
        Users
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

export default GetUsers;