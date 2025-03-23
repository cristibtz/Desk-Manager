import React from "react";
import GetUsers from "./GetUsers";

function Users({token}) {
    
    return (
        <div className="bg-[#f37f0c] min-h-screen">
          <div>
              <h1 className="text-3xl text-center underline font-bold text-white p-4">
                Users
              </h1>
          </div>

          <GetUsers token={token} />
        </div>
    );
}

export default Users;