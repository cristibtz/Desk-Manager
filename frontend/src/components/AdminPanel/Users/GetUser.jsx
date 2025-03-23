import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { KeycloakContext } from "../../../KeycloakContext";

import { fetchUser } from "../../../utils/fetchData/AdminData/fetchUser";
import Table from "../../TableComponents/Table";
import TableCell from "../../TableComponents/TableCell";

function GetUser() {
    const { token } = useContext(KeycloakContext);
    const [userData, setUserData] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (token, id) {
        fetchUser(token, id).then(setUserData);
        }
    }, [token]);

    if (!userData) {
        return <p className="text-center text-white">No user found.</p>;
    }
    const columns = ["User ID", "Username", "Email", "Reservations"];

    const renderRow = (user) => (
        <>
            <TableCell> {user.id}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
                <a href={`/users/${user.id}/reservations`}>View Reservations</a>
            </TableCell>
        </>
    );

    return (
        <div className="min-h-screen bg-[#f37f0c]">
            <h2 className="text-2xl font-bold text-white underline p-4">
                User
            </h2>
            <div className="table-container">
                <Table columns={columns} data={[userData]} renderRow={renderRow} />
            </div>
        </div>
    );
}

export default GetUser;