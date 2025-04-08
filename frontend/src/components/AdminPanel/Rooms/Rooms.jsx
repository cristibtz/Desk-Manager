import React from "react";
import GetRooms from "./GetRooms";
import CreateRoom from "./CreateRoom";
import DeleteRoom from "./DeleteRooms";
import UpdateRoom from "./UpdateRooms";

function Rooms({ token, roomsData }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">

          <GetRooms token={token} />
          
          <h2 className="text-3xl text-center underline font-bold text-white p-4">Manage Rooms</h2>


          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div className="flex-grow w-full">
              <UpdateRoom token={token} roomsData={roomsData}/>
            </div>
            
            <div className="flex-grow w-full">
              <CreateRoom token={token} />
            </div>
            
            <div className="flex-grow w-full">
              <DeleteRoom token={token} roomsData={roomsData}/>
            </div>
          </div>

        </div>

    );
}

export default Rooms;