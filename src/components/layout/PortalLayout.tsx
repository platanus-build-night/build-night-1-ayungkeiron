
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import PortalNavigation from './PortalNavigation';
import { Progress } from '@/components/ui/progress';
import { useLoading } from '@/contexts/LoadingContext';

const PortalLayout = () => {
  const { isPageLoading } = useLoading();

  return (
    <div className="flex flex-col min-h-screen">
      {isPageLoading && (
        <Progress 
          value={100} 
          className="fixed top-0 left-0 right-0 z-50 h-1 animate-pulse" 
        />
      )}
      <Header />
      <main className="flex-grow container py-4">
        <Outlet />
      </main>
      <PortalNavigation />
    </div>
  );
};

export default PortalLayout;
