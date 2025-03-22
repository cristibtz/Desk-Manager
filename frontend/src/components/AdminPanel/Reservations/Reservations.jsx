import React from "react";
import GetReservationsAdmin from "./GetReservationsAdmin";

function Reservations({token, roomsData, desksData}) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">
          <div>
              <h1 className="text-3xl text-center underline font-bold text-white p-4">
                Reservations
              </h1>
          </div>
          <GetReservationsAdmin token={token} roomsData={roomsData} desksData={desksData} />
    
          <h2 className="text-3xl text-center underline font-bold text-white p-4">Manage Reservations</h2>
        </div>
    );
}

export default Reservations;