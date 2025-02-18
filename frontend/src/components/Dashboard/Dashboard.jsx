import React, {useContext, useEffect, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import CreateReservation from "../UserComponents/CreateReservation/CreateReservation";
import GetReservations from "../UserComponents/GetReservations/GetReservations";
import UpdateReservation from "../UserComponents/UpdateReservation/UpdateReservation";
import DeleteReservation from "../UserComponents/DeleteReservation/DeleteReservation";
import { createApiClient } from "../../utils/apiClient";
import "../../css/Table.css"

function Dashboard() {

    const { authenticated, token } = useContext(KeycloakContext);
    const [userInfo, setData] = useState({ name: "", email: "", role: "" });

    useEffect(() => {
        if (authenticated && token) {
          fetchData(token);
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
    <div>
      <h1>Welcome, {userInfo.name} ({userInfo.role}) !</h1>

      <GetReservations token={token} />
      <CreateReservation token={token} />
      <UpdateReservation token={token} />
      <DeleteReservation token={token} />
    </div>
  );
}

export default Dashboard;