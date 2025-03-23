import React, {useContext, useEffect, useState } from "react";

import GetReservationsAdmin from "./GetReservationsAdmin";
import CreateReservationAdmin from "./CreateReservationAdmin";
import UpdateReservationAdmin from "./UpdateReservationAdmin";
import DeleteReservationAdmin from "./DeleteReservationAdmin";

import { fetchReservationsAdmin } from "../../../utils/fetchData/AdminData/fetchReservationsAdmin";

function Reservations({token, roomsData, desksData}) {
    const [reservationsData, setReservationsData] = useState([]);
    
    useEffect(() => {
        if (token) {
          fetchReservationsAdmin(token).then(setReservationsData);
        }
    }
    , [token]);

    return (
        <div className="bg-[#f37f0c] min-h-screen">
          <GetReservationsAdmin token={token} roomsData={roomsData} desksData={desksData} />
    
          <h2 className="text-3xl text-center underline font-bold text-white p-4">Manage Reservations</h2>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div className="flex-grow w-full">
              <UpdateReservationAdmin token={token} reservationsData={reservationsData}/>
            </div>
            
            <div className="flex-grow w-full">
              <CreateReservationAdmin  token={token} roomsData={roomsData}/>
            </div>
            
            <div className="flex-grow w-full">
              <DeleteReservationAdmin token={token} reservationsData={reservationsData}/>
            </div>
          </div>
        </div>
    );
}

export default Reservations;