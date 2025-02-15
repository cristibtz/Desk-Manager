import React, { useEffect, useState } from 'react';
import { initKeycloak, logout} from "./Keycloak"
import axios from 'axios';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {

      const initializeKeycloak = async () => {
      const {authenticated, token}  = await initKeycloak();
      console.log(token);
      setAuthenticated(authenticated);

      const apiClient = axios.create({
        baseURL: import.meta.env.VITE_BACKEND_API_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
    
      const response = await apiClient.get('/frontend');
      console.log(response.data);
      setData(response.data);
  

      };

    initializeKeycloak();


  }, []);

  return (
    <div>
      <h2>Welcome</h2>
      <h3>Role:</h3>
      {authenticated && <button onClick={logout}>Logout</button>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
    
  );
}


export default App;