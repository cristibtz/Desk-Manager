import React from "react";
import GetRooms from "./GetRooms";

function Rooms({ token }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">

          <GetRooms token={token} />
          
        </div>

    );
}

export default Rooms;