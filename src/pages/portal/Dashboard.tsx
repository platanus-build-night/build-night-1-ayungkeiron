
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Dog, QrCode, UserCog } from 'lucide-react';
import PetCard from '@/components/pets/PetCard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useLoading } from '@/contexts/LoadingContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const Dashboard = () => {
  const { setPageLoading } = useLoading();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Query to get user profile data ensuring we're getting the latest data
  const { 
    data: userProfile, 
    isLoading: profileLoading,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      console.log('Dashboard: Fetching user profile for ID:', user?.id);
      
      if (!user?.id) {
        throw new Error('No user session found');
      }
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Dashboard: Error fetching profile:', error);
        throw error;
      }
      
      console.log('Dashboard: Profile fetched successfully:', profile);
      return profile;
    },
    enabled: !!user?.id,
    staleTime: 0, // Consider data always stale to ensure fresh data
  });

  // Query to get user pets with forced refresh - matching the PetList implementation
  const { data: userPets, isLoading: petsLoading, refetch: refetchPets } = useQuery({
    queryKey: ['pets', 'dashboard'],
    queryFn: async () => {
      console.log('Dashboard: Fetching user pets with user ID:', user?.id);
      
      if (!user?.id) {
        console.error('Dashboard: No user ID available');
        throw new Error('No user session found');
      }
      
      const { data: pets, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);
        
      if (error) {
        console.error('Dashboard: Error fetching pets:', error);
        toast.error('No se pudieron cargar las mascotas. Por favor intenta de nuevo.');
        throw error;
      }
      
      console.log('Dashboard: Pets fetched successfully:', pets);
      return pets;
    },
    enabled: !!user?.id, // Only run query when user ID is available
    staleTime: 0, // Consider data always stale to ensure fresh data
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Force a refetch of data when the component mounts
  useEffect(() => {
    if (user?.id) {
      console.log('Dashboard: Refetching all data on mount');
      queryClient.removeQueries({ queryKey: ['pets', 'dashboard'] }); // Force complete refetch
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      refetchProfile();
      refetchPets();
    }
  }, [user?.id, refetchProfile, refetchPets, queryClient]);
  
  // Auto-refresh effect that runs once after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Dashboard: Auto-refresh timer triggered');
      refetchPets();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [refetchPets]);

  useEffect(() => {
    setPageLoading(petsLoading || profileLoading);
    
    return () => setPageLoading(false);
  }, [petsLoading, profileLoading, setPageLoading]);

  if (petsLoading || profileLoading) {
    return (
      <div className="space-y-8 pb-16">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  console.log('Dashboard: Rendering with profile data:', userProfile);
  console.log('Dashboard: Rendering with pets data:', userPets);

  // Only show incomplete profile card if profile is truly incomplete
  const isProfileIncomplete = !userProfile?.name || !userProfile?.email || !userProfile?.address;

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Mascotas</h1>
        <Button 
          onClick={() => {
            queryClient.removeQueries({ queryKey: ['pets', 'dashboard'] });
            refetchPets();
            toast.info('Actualizando lista de mascotas...');
            console.log('Dashboard: Manual refresh of pets');
          }}
          variant="outline" 
          size="sm"
        >
          Actualizar
        </Button>
      </div>

      {isProfileIncomplete && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mb-4">
              <UserCog className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">Completa tu Perfil</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Añade tu información personal para mejorar la experiencia
            </p>
            <Button asChild variant="outline">
              <Link to="/portal/profile">Agregar Información</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {userPets && userPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {userPets.map((pet) => (
            <PetCard
              key={pet.id}
              id={pet.id}
              name={pet.name}
              species={pet.species}
              breed={pet.breed}
              photoUrl={pet.photo_url}
            />
          ))}
          
          <Card className="flex items-center justify-center h-full min-h-[200px] border-dashed border-2 bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">Añadir mascota</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Crea la ficha médica digital para otra mascota
              </p>
              <Button asChild>
                <Link to="/portal/add-pet">Crear nueva mascota</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center p-12">
            <div className="rounded-full bg-muted h-12 w-12 flex items-center justify-center mb-4">
              <Dog className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">No tienes mascotas registradas</h2>
            <p className="text-muted-foreground mb-6">
              Comienza agregando tu primera mascota para crear su ficha médica digital
            </p>
            <Button asChild size="lg">
              <Link to="/portal/add-pet">
                <Plus className="mr-2 h-4 w-4" />
                Crear mi primera mascota
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Escanear QR</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            ¿Encontraste una mascota con un código QR de DogTrackCare? Escanéalo para ver su información
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/scan" className="flex items-center justify-center gap-2">
              <QrCode className="h-4 w-4" />
              Escanear código QR
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
