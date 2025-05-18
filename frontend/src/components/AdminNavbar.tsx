import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { List, Grid, Users, LogOut } from 'react-feather';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-6 shadow-lg">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link 
                to={`/admin/category?token=${token}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Grid size={20} />
                <span>Categories</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`/admin/manufacturer?token=${token}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Users size={20} />
                <span>Manufacturers</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`/admin/cars?token=${token}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <List size={20} />
                <span>Cars</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-lg hover:bg-red-600 transition-colors text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar; 