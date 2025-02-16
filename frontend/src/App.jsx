import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Landing from './components/Landing/Landing';
import { KeycloakProvider } from './KeycloakContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {

  return (
    <KeycloakProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} ></Route>
          <Route path="/" element={<Landing />}></Route>
        </Routes>
      </Router>
    </KeycloakProvider>
  );
}


export default App;