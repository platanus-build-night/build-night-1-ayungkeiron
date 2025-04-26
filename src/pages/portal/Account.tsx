import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '@/lib/utils';
import { LogOut, Edit, Save } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, signOut, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  console.log('Account: Componente inicializado, usuario autenticado:', isAuthenticated);
  console.log('Account: ID de usuario:', user?.id);
  
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      console.log('Account: Obteniendo perfil para usuario:', user?.id);
      
      if (!user?.id) {
        console.error("Account: No hay ID de usuario para obtener el perfil");
        throw new Error('No user ID available');
      }
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
      
      if (!profile) {
        console.log("No profile found for user:", user.id);
        throw new Error('No user profile found');
      }
      
      console.log("Profile fetched successfully:", profile);
      return profile;
    },
    enabled: !!user?.id,
    retry: false,
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      address: userProfile?.address || '',
    },
    defaultValues: {
      name: '',
      email: '',
      address: '',
    },
  });
  
  React.useEffect(() => {
    if (userProfile) {
      console.log('Account: Actualizando formulario con datos del perfil');
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
        address: userProfile.address || '',
      });
    }
  }, [userProfile, form]);
  
  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      console.log('Account: Actualizando perfil para usuario:', user?.id);
      
      if (!user?.id) {
        console.error("Account: No hay ID de usuario para actualizar el perfil");
        throw new Error('No user ID available');
      }

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Account: Perfil actualizado con éxito');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({
        title: 'Perfil actualizado',
        description: 'Tu información ha sido guardada correctamente',
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil. Por favor intenta de nuevo.',
        variant: 'destructive',
      });
      console.error('Error updating profile:', error);
    },
  });
  
  const onSubmit = (data: ProfileFormValues) => {
    console.log('Account: Enviando datos del formulario:', data);
    updateProfile.mutate(data);
  };
  
  const handleLogout = async () => {
    console.log('Account: Iniciando proceso de cierre de sesión');
    await signOut();
    navigate('/');
  };
  
  if (error) {
    console.log('Account: Error al cargar perfil, mostrando estado de error');
    return (
      <div className="space-y-6 pb-16">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              No se pudo cargar la información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/')} className="mr-2">
              Volver al inicio
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (isLoading || !userProfile) {
    console.log('Account: Cargando perfil, mostrando estado de carga');
    return (
      <div className="space-y-6 pb-16">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  console.log('Account: Renderizando formulario de perfil');
  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold">Mi cuenta</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>
                {isEditing ? 'Edita tus datos personales' : 'Tus datos personales'}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tu nombre" 
                        {...field} 
                        value={field.value || ''} 
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
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
                    <FormLabel>Correo electrónico (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="tu@email.com" 
                        {...field} 
                        value={field.value || ''} 
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
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
                    <FormLabel>Dirección (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tu dirección" 
                        {...field} 
                        value={field.value || ''} 
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {isEditing && (
                <div className="pt-2 flex gap-2">
                  <Button 
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset({
                        name: userProfile?.name || '',
                        email: userProfile?.email || '',
                        address: userProfile?.address || '',
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {userProfile.phone_number && (
        <Card>
          <CardHeader>
            <CardTitle>Número de teléfono</CardTitle>
            <CardDescription>
              Tu número de teléfono verificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-medium">{formatPhoneNumber(userProfile.phone_number.replace(/^\+/, ''))}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Account;
