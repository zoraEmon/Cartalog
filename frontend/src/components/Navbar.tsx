import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../resources/imgs/carlogo32.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/Home" className="flex items-center">
            <img src={logo} alt="PCMS Logo" className="h-8 w-auto" />
            <span className="ml-2 text-2xl font-bold text-blue-600">Cartalog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/Home" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              HOME
            </Link>
            <Link to="/Catalog" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              CATALOG
            </Link>
            <Link to="/About" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              ABOUT US
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/Home"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            HOME
          </Link>
          <Link
            to="/Catalog"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            CATALOG
          </Link>
          <Link
            to="/About"
            className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            ABOUT US
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 