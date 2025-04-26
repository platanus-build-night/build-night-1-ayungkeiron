
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, refreshSession } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [refreshAttempted, setRefreshAttempted] = useState(false);

  useEffect(() => {
    // Solo intentar refrescar la sesión una vez para evitar loops
    const checkAuth = async () => {
      if (!isAuthenticated && !isLoading && !refreshAttempted) {
        console.log('ProtectedRoute: No autenticado, refrescando sesión...');
        setRefreshAttempted(true);
        await refreshSession();
        
        // Esperar un momento para asegurarse de que el estado de autenticación se actualizó
        setTimeout(() => {
          console.log('ProtectedRoute: Verificación de autenticación completada');
          setIsCheckingAuth(false);
        }, 300);
      } else {
        console.log('ProtectedRoute: Autenticación verificada');
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isLoading, refreshSession, refreshAttempted]);

  // Determinar redirección solo cuando terminamos de verificar
  useEffect(() => {
    if (!isCheckingAuth && !isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: Acceso denegado, estableciendo redirección a login');
      setShouldRedirect(true);
    }
  }, [isCheckingAuth, isLoading, isAuthenticated]);

  if (isLoading || isCheckingAuth) {
    console.log('ProtectedRoute: Cargando estado de autenticación...');
    return (
      <div className="container py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (shouldRedirect) {
    console.log('ProtectedRoute: Redirigiendo a login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('ProtectedRoute: Acceso permitido, mostrando ruta protegida');
  return <>{children}</>;
};

export default ProtectedRoute;
