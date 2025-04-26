
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, ArrowLeft, Dog, Cat } from 'lucide-react';
import { formatPhoneNumber } from '@/lib/utils';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PublicPet = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: pet, isLoading: isPetLoading } = useQuery({
    queryKey: ['public-pet', id],
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
  
  const { data: owner, isLoading: isOwnerLoading } = useQuery({
    queryKey: ['pet-owner', pet?.owner_id],
    queryFn: async () => {
      if (!pet?.owner_id) throw new Error('No owner ID found');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', pet.owner_id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!pet?.owner_id,
  });
  
  const isLoading = isPetLoading || isOwnerLoading;
  
  if (isLoading) {
    return (
      <div className="container py-4">
        <div className="mb-4">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        
        <Card className="max-w-md mx-auto border-none shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-brand-purple-light to-brand-purple"></div>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <Skeleton className="h-8 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto mt-1" />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="font-medium mb-2">Información del dueño</h2>
                <Skeleton className="h-16 w-full" />
              </div>
              
              <div>
                <h2 className="font-medium mb-2">Información médica relevante</h2>
                <Skeleton className="h-16 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!pet || !owner) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Mascota no encontrada</h1>
        <p className="text-muted-foreground mb-6">
          La ficha que estás buscando no existe o ha sido eliminada
        </p>
        <Button asChild>
          <Link to="/">Ir al inicio</Link>
        </Button>
      </div>
    );
  }
  
  const handleCall = () => {
    window.location.href = `tel:+${owner.phone_number}`;
  };
  
  const handleWhatsApp = () => {
    const message = `Hola, he encontrado a ${pet.name} con un código QR de DogTrackCare.`;
    window.open(`https://wa.me/${owner.phone_number}?text=${encodeURIComponent(message)}`, '_blank');
  };
  
  return (
    <div className="container py-4">
      <div className="mb-4">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>
      
      <Card className="max-w-md mx-auto border-none shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-brand-purple-light to-brand-purple flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            {pet.species === 'Perro' ? (
              <Dog className="h-12 w-12 text-white" />
            ) : (
              <Cat className="h-12 w-12 text-white" />
            )}
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <p className="text-muted-foreground">
              {pet.species === 'Perro' ? 'Perro' : 'Gato'}
              {pet.breed ? ` · ${pet.breed}` :
               pet.color ? ` · ${pet.color}` : ''}
            </p>
            {pet.birth_date && (
              <p className="text-sm text-muted-foreground mt-1">
                Nacimiento: {format(new Date(pet.birth_date), 'PP', { locale: es })}
              </p>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-medium mb-2">Información del dueño</h2>
              <div className="bg-gray-50 p-3 rounded-md">
                {owner.name && <p className="font-medium">{owner.name}</p>}
                <p className="text-muted-foreground">
                  {formatPhoneNumber(owner.phone_number.replace(/^\+/, ''))}
                </p>
              </div>
            </div>
            
            {(pet.allergies || pet.microchip) && (
              <div>
                <h2 className="font-medium mb-2">Información médica relevante</h2>
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  {pet.allergies && (
                    <p className="text-sm">
                      <span className="font-medium">Alergias:</span> {pet.allergies}
                    </p>
                  )}
                  {pet.microchip && (
                    <p className="text-sm">
                      <span className="font-medium">Microchip:</span> {pet.microchip}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Button onClick={handleCall} className="w-full flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Llamar al dueño
              </Button>
              
              <Button 
                onClick={handleWhatsApp} 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] hover:text-white"
              >
                <WhatsappIcon className="h-4 w-4" />
                Enviar WhatsApp
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Esta es una ficha pública generada por DogTrackCare.<br />
              Gracias por ayudar a conectar mascotas con sus dueños.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicPet;
