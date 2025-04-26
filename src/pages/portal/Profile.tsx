import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { setPageLoading } = useLoading();

  console.log('Profile: Componente inicializado, usuario ID:', user?.id);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      console.log('Profile: Obteniendo datos de perfil para usuario:', user?.id);
      
      if (!user?.id) {
        console.error('Profile: No hay ID de usuario disponible');
        throw new Error('No user ID available');
      }
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile: Perfil obtenido correctamente:', profile);
      return profile;
    },
    enabled: !!user?.id,
    staleTime: 0,
  });

  useEffect(() => {
    setPageLoading(isLoading);
    
    return () => setPageLoading(false);
  }, [isLoading, setPageLoading]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
    },
  });

  useEffect(() => {
    if (profile) {
      console.log('Profile: Actualizando formulario con datos del perfil');
      form.reset({
        name: profile.name || '',
        email: profile.email || '',
        address: profile.address || '',
      });
    }
  }, [profile, form]);

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      console.log('Profile: Actualizando perfil para usuario:', user?.id);
      
      if (!user?.id) {
        console.error('Profile: No hay ID de usuario para actualizar');
        throw new Error('No user ID available');
      }
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: data.name,
          email: data.email,
          address: data.address,
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
      
      console.log('Profile: Perfil actualizado correctamente');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido guardada correctamente',
      });
      navigate('/portal');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log('Profile: Enviando datos del formulario:', data);
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto pb-16">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
        <h1 className="text-2xl font-bold mb-6">
          <Skeleton className="h-8 w-48" />
        </h1>
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

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

      <h1 className="text-2xl font-bold mb-6">
        {profile?.name ? 'Editar Información' : 'Agregar Información'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" type="email" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Tu dirección" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
