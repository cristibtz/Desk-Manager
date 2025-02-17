import React, { useContext } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import './NavBar.css';

function NavBar() {

  const { authenticated, role, logout } = useContext(KeycloakContext);

  return (
    <nav className="navbar">
        <div className="navbar-brand">Desk Manager</div>
        <ul className="navbar-nav">
            {authenticated && (
                <>
                    <li className="nav-item"><a href="/dashboard">Dashboard</a></li>
                    <li className="nav-item"><a href="/occupied">Occupied desks</a></li>
                    {role === "Admin" && (
                            <li className="nav-item"><a href="/admin">Admin Panel</a></li>
                    )}
                    <li className="nav-item"><a href="#" onClick={logout}>Logout</a></li>
                </>
            )}
        </ul>
     </nav>
  );
}

export default NavBar;