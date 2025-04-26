import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PetForm, { PetFormValues } from '@/components/pets/PetForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EditPet = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
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
  
  const updatePet = useMutation({
    mutationFn: async (data: PetFormValues) => {
      if (!id) throw new Error('No pet ID provided');
      
      const birthDateString = format(data.birth_date, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('pets')
        .update({
          name: data.name,
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
        })
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet', id] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Mascota actualizada exitosamente');
      navigate(`/portal/pets/${id}`);
    },
    onError: (error) => {
      toast.error('Error al actualizar la mascota. Por favor intenta de nuevo.');
      console.error('Error updating pet:', error);
    },
  });
  
  const deletePet = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('No pet ID provided');
      
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Mascota eliminada', {
        description: 'La mascota ha sido eliminada correctamente',
      });
      navigate('/portal/pets');
    },
    onError: (error) => {
      toast.error('Error al eliminar la mascota', {
        description: 'No se pudo eliminar la mascota. Por favor intenta de nuevo.',
      });
      console.error('Error deleting pet:', error);
    },
  });
  
  const handleSubmit = (data: PetFormValues) => {
    updatePet.mutate(data);
  };
  
  if (isLoading) {
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
        
        <Skeleton className="h-8 w-48 mb-6" />
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  
  if (!pet) {
    navigate('/portal/pets');
    return null;
  }
  
  const birthDate = pet.birth_date ? new Date(pet.birth_date) : new Date();
  
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
      
      <h1 className="text-2xl font-bold mb-6">Editar {pet.name}</h1>
      
      <PetForm 
        defaultValues={{
          name: pet.name,
          species: pet.species || undefined,
          breed: pet.breed || '',
          birth_date: birthDate,
          qr_number: pet.qr_number || '',
          gender: pet.gender || 'unknown',
          color: pet.color || '',
          weight: pet.weight?.toString() || '',
          sterilized: pet.sterilized || false,
          microchip: pet.microchip || '',
          allergies: pet.allergies || '',
        }}
        onSubmit={handleSubmit}
        isSubmitting={updatePet.isPending}
      />

      <Button
        variant="destructive"
        className="w-full mt-4"
        onClick={() => setShowDeleteDialog(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Eliminar mascota
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La mascota y todos sus eventos médicos serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deletePet.mutate();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditPet;
