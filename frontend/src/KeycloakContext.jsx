import React, { createContext, useState, useEffect } from 'react';
import { keycloak, initKeycloak, logout } from './Keycloak';
import { jwtDecode } from "jwt-decode";

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {

    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState("");

  
    useEffect(() => {
      const initializeKeycloak = async () => {

        const { authenticated, token } = await initKeycloak();
        setAuthenticated(authenticated);
        console.log(token)
        setToken(token);
  
        if (authenticated && token) {
          const decodedToken = jwtDecode(token);
          const roles = decodedToken.realm_access?.roles || [];
          const userRole = roles.includes("admin") ? "Admin" : "User";
          setRole(userRole);
        }
      };
      
      initializeKeycloak();

      const refreshToken = async () => {
        if (keycloak.token) {
          try {
            await keycloak.updateToken();
            setToken(keycloak.token);
            console.log('Token refreshed ', keycloak.token );
          } catch (error) {
            console.error('Failed to refresh token:', error);
          }
        }
      };
  
      const intervalId = setInterval(refreshToken, 600000); 

      return () => clearInterval(intervalId); 

    }, []);
  
    return (
      <KeycloakContext.Provider value={{ authenticated, token, role, logout }}>
        {children}
      </KeycloakContext.Provider>
    );
  };