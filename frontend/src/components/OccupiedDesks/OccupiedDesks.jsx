import React, {useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import { createApiClient } from "../../utils/apiClient";
import { formatDate } from "../../utils/formatDate";
import { fetchDesks } from "../../utils/fetchDesks";
import { fetchRooms } from "../../utils/fetchRooms";
import { getDeskNumber, getRoomAlias } from "../../utils/mapRoomDesk";
import "../../css/Table.css"

function OccupiedDesks() {

    const { authenticated, token } = useContext(KeycloakContext);
    const [occupied, setOccupiedData] = useState([]);
    const [desksData, setDesksData] = useState(null);
    const [roomsData, setRoomsData] = useState(null);

    useEffect(() => {
        if (authenticated && token) {
          fetchOccupied(token);
          fetchDesks(token).then(setDesksData);
          fetchRooms(token).then(setRoomsData);
        }
    }, [authenticated, token]);

    const fetchOccupied = async (token) => {

      const apiClient = createApiClient(token);
    
      const occupiedDesks = await apiClient.get('/occupied');
      
      setOccupiedData(occupiedDesks.data);

    };
  return (
    <div>
        <div className="table-container">
        {occupied.length > 0 ? (
            <table className="table">
                <thead>
                <tr>
                    <th>Room Name</th>
                    <th>Desk Number</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                <tbody>
                {occupied.map((desk, index) => (
                    <tr key={`${desk.desk_id}-${desk.room_id}-${index}`}>
                    <td>{getRoomAlias(desk.room_id, roomsData)}</td>
                    <td>{getDeskNumber(desk.desk_id, desksData)}</td>
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