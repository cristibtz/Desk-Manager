import React from "react";
import GetReservationsAdmin from "./GetReservationsAdmin";
import CreateReservationAdmin from "./CreateReservationAdmin";
import UpdateReservationAdmin from "./UpdateReservationAdmin";
import DeleteReservationAdmin from "./DeleteReservationAdmin";

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

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div className="flex-grow w-full">
              <UpdateReservationAdmin />
            </div>
            
            <div className="flex-grow w-full">
              <CreateReservationAdmin  />
            </div>
            
            <div className="flex-grow w-full">
              <DeleteReservationAdmin />
            </div>
          </div>
        </div>
    );
}

export default Reservations;