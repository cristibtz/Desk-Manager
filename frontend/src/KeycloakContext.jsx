import React, { createContext, useState, useEffect } from 'react';
import { initKeycloak, logout } from './Keycloak';

export const KeycloakContext = createContext();

export const KeycloakProvider = ({ children }) => {

    const [authenticated, setAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
  
    useEffect(() => {
      const initializeKeycloak = async () => {

        const { authenticated, token } = await initKeycloak();
        setAuthenticated(authenticated);
        setToken(token);
  
      };
      
      initializeKeycloak();
    }, []);
  
    return (
      <KeycloakContext.Provider value={{ authenticated, token, logout }}>
        {children}
      </KeycloakContext.Provider>
    );
  };