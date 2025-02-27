import React, { useContext, useState } from "react";
import { KeycloakContext } from "../../KeycloakContext";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

function NavBar() {
  const { authenticated, role, logout } = useContext(KeycloakContext);
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const requiredRole = import.meta.env.VITE_REQUIRED_ROLE;

  return (
    <nav className="bg-white flex justify-between items-center h-32 max-w-auto mx-auto px-2 text-white whitespace-nowrap">
        {/*Desktop*/}
        <h1 className='w-full text-3xl font-bold text-[#f37f0c] p-4'>Desk Manager</h1>

        <ul className="hidden md:flex">
            {authenticated && (
                <>
                    <li className="p-4 text-[#f37f0c] hover:bg-[#f37f0c] rounded-xl m-2 cursor-pointer text-xl duration-300 hover:text-white whitespace-nowrap"><a href="/dashboard">Dashboard</a></li>
                    <li className="p-4 text-[#f37f0c] hover:bg-[#f37f0c] rounded-xl m-2 cursor-pointer text-xl duration-300 hover:text-white whitespace-nowrap"><a href="/occupied">Occupied desks</a></li>
                    {role === requiredRole && (
                            <li className="p-4 text-[#f37f0c] hover:bg-[#f37f0c] rounded-xl m-2 cursor-pointer text-xl text-xlduration-300 hover:text-white whitespace-nowrap"><a href="/admin">Admin Panel</a></li>
                    )}
                    <li className="p-4 text-[#f37f0c] hover:bg-[#f37f0c] rounded-xl m-2 cursor-pointer text-xl duration-300 hover:text-white whitespace-nowrap"><a href="#" onClick={logout}>Logout</a></li>
                </>
            )}
        </ul>

        {/*Mobile*/}
        <div className="md:hidden" onClick={handleNav}>
            {!nav ? <AiOutlineMenu size={30} className="text-black" /> : <AiOutlineClose size={30} className="text-gray-400" />}
        </div>

        <div className={nav ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-white-900 bg-[#f37f0c] ease-in-out duration-500" : "fixed left-[-100%]"}>
            <h1 className="w-full text-3xl font-bold text-white m-4">Desk Manager</h1>
            <ul className="p-4 uppercase">
            {authenticated && (
                <>
                <li className="p-4 border-b border-white-600">
                    <a href="/dashboard">Dashboard</a>
                </li>
                <li className="p-4 border-b border-white-600">
                    <a href="/occupied">Occupied desks</a>
                </li>
                {role === requiredRole && (
                    <li className="p-4 border-b border-white-600">
                    <a href="/admin">Admin Panel</a>
                    </li>
                )}
                <li className="p-4 border-b border-white-600">
                    <a href="#" onClick={logout}>Logout</a>
                </li>
                </>
            )}
            </ul>
        </div>
     </nav>
  );
}

export default NavBar;