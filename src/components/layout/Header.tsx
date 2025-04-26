
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, User, QrCode } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isPublicRoute = !location.pathname.startsWith('/portal');
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo-dogtrackcare.svg" 
              alt="DogTrackCare"
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg'; // Fallback logo
                e.currentTarget.alt = 'DTC';
              }}
            />
            <span className="ml-2 font-bold text-brand-purple-dark hidden md:inline">
              DogTrackCare
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {isPublicRoute ? (
            <Button asChild variant="outline" className="gap-1">
              <Link to="/login">
                <User className="h-4 w-4 mr-1" />
                <span>Ingresar</span>
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" className="p-2">
              <Link to="/portal">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          )}
          
          <Button asChild variant="ghost" className="p-2">
            <Link to="/scan">
              <QrCode className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
