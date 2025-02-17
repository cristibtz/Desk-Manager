import React, {useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import { createApiClient } from "../../utils/apiClient";
import { formatDate } from "../../utils/formatDate";
import "../../css/Table.css"

function OccupiedDesks() {

    const { authenticated, token, logout } = useContext(KeycloakContext);
    const [occupied, setOccupiedData] = useState([]);

    useEffect(() => {
        if (authenticated && token) {
          fetchOccupied(token);
        }
    }, [authenticated, token]);

    const fetchOccupied = async (token) => {

      const apiClient = createApiClient(token);
    
      const occupiedDesks = await apiClient.get('/occupied');
      console.log(occupiedDesks.data);
      
      setOccupiedData(occupiedDesks.data);

    };
  return (
    <div>
        <div className="table-container">
        {occupied.length > 0 ? (
            <table className="table">
                <thead>
                <tr>
                    <th>Room ID</th>
                    <th>Desk ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                <tbody>
                {occupied.map((desk) => (
                    <tr key={desk.desk_id}>
                    <td>{desk.room_id}</td>
                    <td>{desk.desk_id}</td>
                    <td>{formatDate(desk.start_date)}</td>
                    <td>{formatDate(desk.end_date)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p>No reservations found.</p>
        )}
        </div>
    </div>
  );
}

export default OccupiedDesks;