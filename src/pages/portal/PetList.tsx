
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/pets/PetCard';
import { Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const PetList = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Use the auth context to access the user
  
  // Force data refresh when the component mounts
  useEffect(() => {
    console.log('PetList mounted, invalidating pets query to force refresh');
    queryClient.invalidateQueries({ queryKey: ['pets'] });
    queryClient.removeQueries({ queryKey: ['pets'] }); // Force complete refetch
  }, [queryClient]);
  
  const { data: userPets, isLoading, error, refetch } = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      console.log('Fetching pets list with user ID:', user?.id);
      
      if (!user?.id) {
        console.error('No user ID available in AuthContext');
        throw new Error('No user session found');
      }
      
      const { data: pets, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);
        
      if (error) {
        console.error('Error fetching pets list:', error);
        throw error;
      }
      
      console.log('Pets fetched successfully:', pets);
      return pets;
    },
    staleTime: 0, // Consider data always stale to ensure fresh data
    enabled: !!user?.id, // Only run query when user ID is available
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });
  
  useEffect(() => {
    if (error) {
      console.error('Error in pets query:', error);
      toast.error('No se pudieron cargar las mascotas. Por favor intenta de nuevo.');
    }
  }, [error]);

  // Function to manually refresh the data
  const handleRefresh = () => {
    console.log('Manual refresh of pets list triggered');
    queryClient.removeQueries({ queryKey: ['pets'] });
    refetch();
    toast.info('Actualizando lista de mascotas...');
  };

  // Auto-refresh effect that runs once after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-refresh timer triggered');
      refetch();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Todas mis mascotas</h1>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Actualizar
          </Button>
          <Button asChild size="sm">
            <Link to="/portal/add-pet" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Añadir mascota
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userPets?.length > 0 ? (
          userPets.map((pet) => (
            <PetCard
              key={pet.id}
              id={pet.id}
              name={pet.name}
              species={pet.species}
              breed={pet.breed}
              photoUrl={pet.photo_url}
            />
          ))
        ) : (
          <div className="col-span-2 text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No tienes mascotas registradas.</p>
            <Button asChild className="mt-4">
              <Link to="/portal/add-pet">
                <Plus className="mr-2 h-4 w-4" />
                Añadir mi primera mascota
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetList;
