import React from "react";
import GetRooms from "./GetRooms";

function Rooms({ token }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">
          <div>
              <h1 className="text-3xl text-center underline font-bold text-white p-4">
                Rooms
              </h1>
          </div>

          <GetRooms token={token} />
        </div>

    );
}

export default Rooms;