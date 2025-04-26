import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import type { EventFormValues } from '@/components/medical-events/ManualEntryForm';

export const useMedicalEvent = (id: string | undefined, eventId: string | null) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    if (!id) throw new Error('No pet ID provided');
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('medical-events')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('medical-events')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error('Error al subir la imagen', {
        description: 'Por favor intenta de nuevo'
      });
      throw new Error('Error al subir la imagen');
    }
  };

  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: ['medical-event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      
      const { data, error } = await supabase
        .from('medical_events')
        .select('*')
        .eq('id', eventId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  const createMedicalEvent = useMutation({
    mutationFn: async (data: EventFormValues) => {
      if (!id) throw new Error('No pet ID provided');
      
      let uploadedImageUrl = null;
      try {
        if (currentImage) {
          uploadedImageUrl = await uploadImageToSupabase(currentImage);
        }
        
        if (eventId) {
          const updateData: any = {
            type: data.type,
            title: data.title,
            date: data.date,
            description: data.description || null
          };
          
          if (uploadedImageUrl) {
            updateData.attachments = [uploadedImageUrl];
          }
          
          const { error } = await supabase
            .from('medical_events')
            .update(updateData)
            .eq('id', eventId);
            
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('medical_events')
            .insert({
              pet_id: id,
              type: data.type,
              title: data.title,
              date: data.date,
              description: data.description || null,
              attachments: uploadedImageUrl ? [uploadedImageUrl] : null,
            });
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error with medical event operation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-events', id] });
      const actionType = eventId ? 'actualizado' : 'creado';
      toast.success(`Evento médico ${actionType}`, {
        description: `El evento médico ha sido ${actionType} correctamente`,
      });
      navigate(`/portal/pets/${id}?tab=events`);
    },
    onError: (error) => {
      console.error('Error with medical event operation:', error);
      toast.error('Error', {
        description: 'No se pudo completar la operación. Por favor intenta de nuevo.',
      });
    },
  });

  const deleteMedicalEvent = useMutation({
    mutationFn: async () => {
      if (!eventId) throw new Error('No event ID provided');
      
      const { error } = await supabase
        .from('medical_events')
        .delete()
        .eq('id', eventId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-events', id] });
      toast.success('Evento médico eliminado', {
        description: 'El evento médico ha sido eliminado correctamente',
      });
      navigate(`/portal/pets/${id}?tab=events`);
    },
    onError: (error) => {
      console.error('Error deleting medical event:', error);
      toast.error('Error', {
        description: 'No se pudo eliminar el evento médico. Por favor intenta de nuevo.',
      });
    },
  });

  return {
    eventData,
    isEventLoading,
    createMedicalEvent,
    deleteMedicalEvent,
    currentImage,
    setCurrentImage,
    imageUrl,
    setImageUrl,
  };
};
