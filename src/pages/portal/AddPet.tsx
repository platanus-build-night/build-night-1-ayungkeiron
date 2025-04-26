
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PetForm, { PetFormValues } from '@/components/pets/PetForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const AddPet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const createPetMutation = useMutation({
    mutationFn: async (data: PetFormValues) => {
      if (!user?.id) {
        toast.error('No hay sesión de usuario activa');
        throw new Error('No user session found');
      }
      
      console.log('Creating pet with user ID:', user.id);
      
      const birthDateString = format(data.birth_date, 'yyyy-MM-dd');
      
      const petData = {
        name: data.name,
        owner_id: user.id,
        birth_date: birthDateString,
        species: data.species || null,
        breed: data.breed || null,
        qr_number: data.qr_number || null,
        gender: data.gender || null,
        color: data.color || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        sterilized: data.sterilized || false,
        microchip: data.microchip || null,
        allergies: data.allergies || null,
      };
      
      console.log('Pet data to insert:', petData);
      
      const { data: newPet, error } = await supabase
        .from('pets')
        .insert(petData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating pet:', error);
        throw error;
      }
      
      console.log('Pet created successfully:', newPet);
      return newPet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.removeQueries({ queryKey: ['pets'] });
      toast.success('Mascota creada exitosamente');
      navigate('/portal/pets');
    },
    onError: (error) => {
      console.error('Error creating pet:', error);
      toast.error('Error al crear la mascota. Por favor intenta de nuevo.');
    }
  });
  
  const handleSubmit = (data: PetFormValues) => {
    createPetMutation.mutate(data);
  };
  
  return (
    <div className="max-w-md mx-auto pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Agregar nueva mascota</h1>
      <PetForm 
        onSubmit={handleSubmit} 
        isSubmitting={createPetMutation.isPending}
      />
    </div>
  );
};

export default AddPet;
