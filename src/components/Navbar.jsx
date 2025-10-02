import React from 'react';
import { IoMdContact } from "react-icons/io";

export const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        <div className="flex-shrink-0">
          <img src={`${import.meta.env.BASE_URL}/logo.png`} alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="hidden sm:block text-gray-600 hover:text-gray-900">Home</a>
          <a href="#" className="hidden sm:block text-gray-600 hover:text-gray-900">About</a>
          <a href="#" className="hidden sm:block text-gray-600 hover:text-gray-900">Contact</a>
          <IoMdContact className="text-4xl text-gray-700 cursor-pointer hover:text-blue-500" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

