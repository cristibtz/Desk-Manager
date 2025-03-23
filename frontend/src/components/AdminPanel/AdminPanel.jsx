import React, { useState, useEffect, useContext} from 'react';
import { KeycloakContext } from "../../KeycloakContext";

import { fetchRooms } from "../../utils/fetchData/fetchRooms";
import { fetchDesks } from "../../utils/fetchData/fetchDesks";

import Reservations  from './Reservations/Reservations';
import Desks  from './Desks/Desks';
import Rooms from './Rooms/Rooms';
import Users from './Users/Users';

function AdminPanel() {
  const [selectedResource, setSelectedResource] = useState('reservations');
  const { authenticated, token } = useContext(KeycloakContext);
  const [roomsData, setRoomsData] = useState([]);
  const [desksData, setDesksData] = useState([]);

  useEffect(() => {
      if (authenticated && token) {
        fetchRooms(token).then(setRoomsData);
        fetchDesks(token).then(setDesksData);
      }
  }, [authenticated, token]);

  const renderResourceComponent = () => {
    switch (selectedResource) {
      case 'reservations':
        return <Reservations token={token} roomsData={roomsData} desksData={desksData} />;
      case 'desks':
        return <Desks token={token}/>;
      case 'rooms':
        return <Rooms token={token}/>;
      case 'users':
        return <Users token={token}/>;
      default:
        return <div className="text-white">Please select a valid resource.</div>;
    }
  };

  return (
    <div className="bg-[#f37f0c] min-h-screen">
      <h1 className="text-3xl text-center underline font-bold text-white p-4">
        Welcome to the admin panel!
      </h1>
  
      <div className="px-4 mb-4">
        <label className="block text-white font-semibold mb-2 text-xl">
          Please choose a resource to interact with:
        </label>
        <select
          name="resource"
          id="resource"
          className="p-2 border border-gray-300 rounded bg-white text-black"
          value={selectedResource}
          onChange={(e) => setSelectedResource(e.target.value)}
        >
          <option value="reservations" className="text-gray-700 text-center">
            Reservations
          </option>
          <option value="users" className="text-gray-700 text-center">
            Users
          </option>
          <option value="rooms" className="text-gray-700 text-center">
            Rooms
          </option>
          <option value="desks" className="text-gray-700 text-center">
            Desks
          </option>
        </select>
      </div>
  
      <div className="mt-4">{renderResourceComponent()}</div>
    </div>
  );
}

export default AdminPanel;