
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
}

interface CustomSession {
  user: UserData;
  expiresAt: string;
}

interface AuthContextType {
  session: Session | CustomSession | null;
  user: User | UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | CustomSession | null>(null);
  const [user, setUser] = useState<User | UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const isRefreshing = useRef(false);
  const { toast } = useToast();

  const refreshSession = async () => {
    if (!isInitialized || isRefreshing.current) return; // Evitar refrescos antes de la inicialización completa o durante otro refresco
    
    try {
      console.log('AuthContext: Refrescando sesión');
      isRefreshing.current = true;
      setIsLoading(true);
      
      // Primero verificar si hay una sesión en localStorage
      const storedSession = localStorage.getItem('userSession');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession) as CustomSession;
          const expiresAt = new Date(parsedSession.expiresAt);
          
          console.log('AuthContext: Sesión encontrada en localStorage', parsedSession);
          
          // Verificar si la sesión ha expirado
          if (expiresAt > new Date()) {
            console.log('AuthContext: Sesión de localStorage válida', parsedSession.user.id);
            setSession(parsedSession);
            setUser(parsedSession.user);
            setIsLoading(false);
            isRefreshing.current = false;
            return;
          } else {
            console.log('AuthContext: Sesión de localStorage expirada');
            localStorage.removeItem('userSession');
          }
        } catch (error) {
          console.error('AuthContext: Error al procesar sesión de localStorage', error);
          localStorage.removeItem('userSession');
        }
      }
      
      // Si no hay sesión en localStorage o expiró, buscar en Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('AuthContext: Error obteniendo sesión de Supabase', error);
        setSession(null);
        setUser(null);
        isRefreshing.current = false;
        setIsLoading(false);
        return;
      }
      
      if (data?.session) {
        console.log('AuthContext: Sesión de Supabase encontrada', data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
      } else {
        console.log('AuthContext: No se encontró sesión en Supabase ni localStorage');
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('AuthContext: Error inesperado refrescando sesión', error);
    } finally {
      setIsLoading(false);
      isRefreshing.current = false;
    }
  };

  useEffect(() => {
    console.log('AuthContext: Inicializando proveedor de autenticación');
    
    const initAuth = async () => {
      setIsLoading(true);
      
      // Verificar primero localStorage para una respuesta rápida
      const storedSession = localStorage.getItem('userSession');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession) as CustomSession;
          const expiresAt = new Date(parsedSession.expiresAt);
          
          if (expiresAt > new Date()) {
            console.log('AuthContext: Usando sesión inicial de localStorage', parsedSession.user.id);
            setSession(parsedSession);
            setUser(parsedSession.user);
          } else {
            console.log('AuthContext: Sesión inicial de localStorage expirada');
            localStorage.removeItem('userSession');
          }
        } catch (error) {
          console.error('AuthContext: Error procesando sesión inicial de localStorage', error);
          localStorage.removeItem('userSession');
        }
      }
      
      // Configurar listener para cambios en el estado de autenticación de Supabase
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log('AuthContext: Cambio en el estado de auth detectado:', event);
          
          if (currentSession) {
            console.log('AuthContext: Nueva sesión detectada en Supabase', currentSession.user.id);
            setSession(currentSession);
            setUser(currentSession.user);
          } else if (event === 'SIGNED_OUT') {
            // Si es un evento explícito de cierre de sesión, limpiar todo
            console.log('AuthContext: Evento de cierre de sesión detectado');
            localStorage.removeItem('userSession');
            setSession(null);
            setUser(null);
          } else {
            // No hacer nada aquí para evitar loops, solo verificar localStorage
            const storedSession = localStorage.getItem('userSession');
            if (storedSession) {
              try {
                const parsedSession = JSON.parse(storedSession) as CustomSession;
                const expiresAt = new Date(parsedSession.expiresAt);
                
                if (expiresAt > new Date()) {
                  console.log('AuthContext: Usando sesión de localStorage después de evento', parsedSession.user.id);
                  setSession(parsedSession);
                  setUser(parsedSession.user);
                } else {
                  console.log('AuthContext: Sesión de localStorage expirada después de evento');
                  localStorage.removeItem('userSession');
                  setSession(null);
                  setUser(null);
                }
              } catch (error) {
                console.error('AuthContext: Error al procesar sesión de localStorage después de evento', error);
                localStorage.removeItem('userSession');
                setSession(null);
                setUser(null);
              }
            } else {
              console.log('AuthContext: No hay sesión en Supabase ni localStorage después de evento');
              setSession(null);
              setUser(null);
            }
          }
          
          setIsLoading(false);
        }
      );
      
      // Verificar Supabase para sesión existente como último recurso, pero solo una vez
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          console.log('AuthContext: Sesión inicial encontrada en Supabase', data.session.user.id);
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (e) {
        console.error('AuthContext: Error obteniendo sesión inicial de Supabase', e);
      }
      
      // Marcar inicialización como completada y finalizar carga
      setIsInitialized(true);
      setIsLoading(false);
      
      // Limpiar listener al desmontar
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    initAuth();
  }, []);
  
  const signOut = async () => {
    try {
      console.log('AuthContext: Iniciando cierre de sesión');
      setIsLoading(true);
      
      // Eliminar sesión de localStorage si existe
      if (localStorage.getItem('userSession')) {
        console.log('AuthContext: Eliminando sesión de localStorage');
        localStorage.removeItem('userSession');
      }
      
      // Cerrar sesión de Supabase si aplica
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthContext: Error al cerrar sesión de Supabase', error);
        toast({
          title: 'Error',
          description: 'No se pudo cerrar sesión. Por favor intenta de nuevo.',
          variant: 'destructive',
        });
        return;
      }
      
      // Limpiar estados
      setSession(null);
      setUser(null);
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
      });
      
      console.log('AuthContext: Sesión cerrada correctamente');
    } catch (error) {
      console.error('AuthContext: Error inesperado cerrando sesión', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAuthenticated: !!session,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
