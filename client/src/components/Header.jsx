import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, PlusCircle, List } from '@phosphor-icons/react';

const Header = () => {
  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-[#121418]/90 backdrop-blur-md border-b border-gray-800/50 z-20">
      <div className="flex items-center gap-4 text-gray-400 w-1/3">
        <MagnifyingGlass size={20} />
        <input type="text" placeholder="Search..." className="bg-transparent outline-none text-white w-full placeholder-gray-500" />
      </div>

      <Link 
        to="/upload" 
        className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-transform"
      >
        <PlusCircle size={20} />
        Upload Caption
      </Link>
    </header>
  );
};

export default Header;