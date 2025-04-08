import React from "react";
import GetUsers from "./GetUsers";

function Users({token}) {
    
    return (
        <div className="bg-[#f37f0c] min-h-screen">

          <GetUsers token={token} />
          
        </div>

    );
}

export default Users;