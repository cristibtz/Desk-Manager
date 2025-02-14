import React, { useEffect, useState } from 'react';
import {initKeycloak, logout} from "./Keycloak"

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

      const initializeKeycloak = async () => {
      const authenticated  = await initKeycloak();
      setAuthenticated(authenticated);
      };

    initializeKeycloak();
  }, []);

  return (
    <div>
      <h2>Welcome </h2>
      <h3>Role: </h3>
      {authenticated && <button onClick={logout}>Logout</button>}

    </div>
    
  );
}


export default App;