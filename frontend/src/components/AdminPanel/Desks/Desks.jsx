import React from "react";
import GetDesks from "./GetDesks";
import CreateDesk from "./CreateDesk";
import DeleteDesk from "./DeleteDesk";
import UpdateDesk from "./UpdateDesk";

function Desks({ token, roomsData }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">

        <GetDesks token={token} />
        
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4">
            <div className="flex-grow w-full">
              <UpdateDesk token={token} />
            </div>
            
            <div className="flex-grow w-full">
              <CreateDesk token={token} roomsData={roomsData} />
            </div>
            
            <div className="flex-grow w-full">
              <DeleteDesk token={token} />
            </div>
        </div>

      </div>

    );
}

export default Desks;