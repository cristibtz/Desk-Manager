import React from "react";
import GetDesks from "./GetDesks";

function Desks({ token }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">

        <GetDesks token={token} />
        
      </div>

    );
}

export default Desks;