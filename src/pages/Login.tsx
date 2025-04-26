
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PhoneVerification from '@/components/onboarding/PhoneVerification';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, refreshSession } = useAuth();
  
  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      console.log('Login: Verificando sesión existente');
      
      if (isAuthenticated) {
        console.log('Login: Usuario ya autenticado, redirigiendo a portal');
        navigate('/portal');
      } else {
        console.log('Login: Usuario no autenticado, refrescando sesión');
        await refreshSession();
        
        // Verificar de nuevo después de refrescar la sesión
        const storedSession = localStorage.getItem('userSession');
        if (storedSession) {
          console.log('Login: Sesión encontrada en localStorage después de refrescar');
          navigate('/portal');
        } else {
          console.log('Login: No se encontró sesión después de refrescar');
        }
      }
    };
    
    checkSession();
  }, [navigate, isAuthenticated, refreshSession]);
  
  const handleVerificationComplete = (sessionData?: any) => {
    // Guardar los datos importantes de la sesión
    console.log('Login: Verificación completada, recibiendo sesión', sessionData);
    
    // Forzar un refresco de la sesión antes de redirigir
    refreshSession().then(() => {
      console.log('Login: Sesión refrescada después de verificación, redirigiendo a portal');
      navigate('/portal');
    });
  };

  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </div>
        
        <PhoneVerification onVerified={handleVerificationComplete} />
      </div>
    </div>
  );
};

export default Login;
