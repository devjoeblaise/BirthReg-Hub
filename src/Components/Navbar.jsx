import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = ({ isAuth }) => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Home", show: true },
    { name: "BirthRecord", show: isAuth },
    { name: "BirthRegistration", show: isAuth },
    { name: "Login", show: !isAuth },
    { name: "Logout", show: isAuth },
  ];

  return (
    <nav className="w-full bg-[#1D242A] text-white shadow-xl font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center animate-mechDrop">
        <h1 className="
          text-xl font-semibold tracking-wider
          hover:text-[#7FFFD4] transition-all duration-500
          hover:scale-[1.05] hover:drop-shadow-[0_0_8px_#7FFFD4]
          cursor-pointer animate-mechSlide
        ">
          ONLINE BIRTH REGISTRATION HUB
        </h1>

        <ul className="hidden md:flex space-x-10 text-sm font-medium">
          {menuItems.filter(item => item.show).map((item, i) => (
            <li key={i} className="relative group transition-all duration-500 animate-mechSlide">
              <Link
                to={item.name === "Home" ? "/" : `/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-[#7FFFD4] transition-all duration-500 tracking-wide"
              >
                {item.name}
              </Link>
              <span className="
                absolute left-0 -bottom-1 w-0 h-0.5
                bg-[#7FFFD4] transition-all duration-500
                group-hover:w-full drop-shadow-[0_0_6px_#7FFFD4]
              "></span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-3xl hover:text-[#7FFFD4] transition-all duration-300"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <div className={`md:hidden bg-[#1D242A] transition-all duration-700 overflow-hidden ${open ? "max-h-64" : "max-h-0"}`}>
        <div className="px-6 pb-4 space-y-4 mt-2">
          {menuItems.filter(item => item.show).map((item, i) => (
            <Link
              key={i}
              to={item.name === "Home" ? "/" : `/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="block text-sm tracking-wide hover:text-[#7FFFD4] transition-all duration-500 hover:ml-1 hover:drop-shadow-[0_0_8px_#7FFFD4]"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
