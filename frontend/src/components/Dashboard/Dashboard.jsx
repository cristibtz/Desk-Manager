import React, {useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";

import CreateReservation from "../UserComponents/CreateReservation/CreateReservation";
import GetReservations from "../UserComponents/GetReservations/GetReservations";
import UpdateReservation from "../UserComponents/UpdateReservation/UpdateReservation";
import DeleteReservation from "../UserComponents/DeleteReservation/DeleteReservation";

import { createApiClient } from "../../utils/apiClient";
import { fetchRooms } from "../../utils/fetchRooms";
import { fetchDesks } from "../../utils/fetchDesks";
import { fetchReservations } from "../../utils/fetchReservations";

import "../../css/Table.css"

function Dashboard() {

    const { authenticated, token } = useContext(KeycloakContext);
    const [userInfo, setData] = useState({ name: "", email: "", role: "" });
    const [roomsData, setRoomsData] = useState([]);
    const [desksData, setDesksData] = useState([]);
    const [reservationsData, setReservationsData] = useState([]);

    useEffect(() => {
        if (authenticated && token) {
          fetchData(token);
          fetchReservations(token).then(setReservationsData);
          fetchRooms(token).then(setRoomsData);
          fetchDesks(token).then(setDesksData);
        }
    }, [authenticated, token]);

    const fetchData = async (token) => {

      const apiClient = createApiClient(token);
    
      const getUserInfo = await apiClient.get('/userinfo');

      setData({
        name: getUserInfo.data.name,
        email: getUserInfo.data.email,
        role: getUserInfo.data.roles.includes("admin") ? "Admin" : "User"
      });
      
    };

  return (
    <div className="bg-[#f37f0c] h-screen w-screen ">
      <div>
          <h1 className="text-3xl text-center underline font-bold text-white p-4">
            Welcome, {userInfo.name} ({userInfo.role}) !
          </h1>
      </div>
      <div className="">
        <GetReservations token={token} roomsData={roomsData} desksData={desksData} />
        <CreateReservation token={token} roomsData={roomsData} />
        <UpdateReservation token={token} reservationsData={reservationsData} />
        <DeleteReservation token={token} reservationsData={reservationsData} />
      </div>
    </div>
  );
}

export default Dashboard;