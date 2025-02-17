import React, { createContext, useState, useEffect } from 'react';
import { initKeycloak, logout } from './Keycloak';
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
        setToken(token);
  
        if (authenticated && token) {
          const decodedToken = jwtDecode(token);
          const roles = decodedToken.realm_access?.roles || [];
          const userRole = roles.includes("admin") ? "Admin" : "User";
          setRole(userRole);
        }
      };
      
      initializeKeycloak();
    }, []);
  
    return (
      <KeycloakContext.Provider value={{ authenticated, token, role, logout }}>
        {children}
      </KeycloakContext.Provider>
    );
  };