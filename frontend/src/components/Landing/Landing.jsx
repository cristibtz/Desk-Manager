import React from "react";

function Landing() {

  return (
    <div>
      <h1 className="text-center text-4xl">
        Hello!
      </h1>
      <h2 className="text-center text-4xl">
        This is a web application that allows you to book desks. 
          <a href="/dashboard" className="underline text-blue-500 hover:text-blue-800">
            Proceed!
          </a>
      </h2>
    </div>
  );
}

export default Landing;