
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Tag } from 'lucide-react';
import PetQRCode from '@/components/pets/PetQRCode';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const PetQR = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      if (!id) throw new Error('No pet ID provided');
      
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    },
  });
  
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto pb-16">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost"
            size="sm"
            asChild
            className="flex items-center gap-1"
          >
            <Link to="/portal/pets">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Link>
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto mt-2" />
        </div>
        
        <Skeleton className="h-64 w-64 mx-auto rounded-lg" />
      </div>
    );
  }
  
  if (!pet) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Mascota no encontrada</h1>
        <Button asChild>
          <Link to="/portal/pets">Volver a la lista</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center gap-1"
        >
          <Link to={`/portal/pets/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a {pet.name}</span>
          </Link>
        </Button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Código QR</h1>
        <p className="text-muted-foreground">
          Este es el código QR único de {pet.name}
        </p>
      </div>
      
      <PetQRCode petId={pet.id} petName={pet.name} />
      
      <div className="mt-12 bg-muted/30 rounded-lg p-6 text-center">
        <h3 className="font-medium mb-2">¿Quieres una placa física?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Solicita una placa con el QR grabado para el collar de {pet.name}
        </p>
        <Button className="gap-2">
          <Tag className="h-4 w-4" />
          Solicitar placa QR
        </Button>
      </div>
    </div>
  );
};

export default PetQR;
