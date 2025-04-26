
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Dog, User, Plus } from 'lucide-react';

const PortalNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container">
        <div className="flex items-center justify-around py-2">
          <NavLink 
            to="/portal" 
            end
            className={({ isActive }) => 
              `flex flex-col items-center py-1 px-4 ${isActive ? 'text-brand-purple' : 'text-gray-500'}`
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Inicio</span>
          </NavLink>
          
          <NavLink 
            to="/portal/pets" 
            className={({ isActive }) => 
              `flex flex-col items-center py-1 px-4 ${isActive ? 'text-brand-purple' : 'text-gray-500'}`
            }
          >
            <Dog className="h-5 w-5" />
            <span className="text-xs mt-1">Mascotas</span>
          </NavLink>
          
          <NavLink 
            to="/portal/add-pet" 
            className={({ isActive }) => 
              `flex flex-col items-center py-1 px-4 ${isActive ? 'text-brand-purple-light font-bold' : 'text-brand-purple-dark'}`
            }
          >
            <div className="bg-brand-purple rounded-full p-2 -mt-6 shadow-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs mt-1">Añadir</span>
          </NavLink>
          
          <NavLink 
            to="/portal/account" 
            className={({ isActive }) => 
              `flex flex-col items-center py-1 px-4 ${isActive ? 'text-brand-purple' : 'text-gray-500'}`
            }
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Perfil</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default PortalNavigation;
