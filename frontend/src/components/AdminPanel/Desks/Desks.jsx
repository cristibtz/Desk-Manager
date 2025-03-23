import React from "react";
import GetDesks from "./GetDesks";

function Desks({ token }) {
    return (
        <div className="bg-[#f37f0c] min-h-screen">
        <div>
            <h1 className="text-3xl text-center underline font-bold text-white p-4">
              Desks
            </h1>
        </div>

        <GetDesks token={token} />
      </div>

    );
}

export default Desks;