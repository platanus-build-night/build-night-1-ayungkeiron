import React from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, QrCode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import PetGeneralInfo from '@/components/pets/PetGeneralInfo';
import PetMedicalEvents from '@/components/pets/PetMedicalEvents';
import PetQRPreview from '@/components/pets/PetQRPreview';

const PetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'info';
  
  const { data: pet, isLoading: isPetLoading } = useQuery({
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
  
  const { data: medicalEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['medical-events', id],
    queryFn: async () => {
      if (!id) throw new Error('No pet ID provided');
      const { data, error } = await supabase
        .from('medical_events')
        .select('*')
        .eq('pet_id', id)
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });
  
  const isLoading = isPetLoading || isEventsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        
        <div>
          <Skeleton className="h-10 w-full" />
          <div className="mt-4 space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
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
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pet.name}</h1>
          <p className="text-muted-foreground">
            {pet.species === 'Perro' ? 'Perro' : 'Gato'}
            {pet.breed ? ` · ${pet.breed}` : ''}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/portal/pets/${id}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <Link to={`/portal/pets/${id}/qr`} className="flex items-center gap-1">
              <QrCode className="h-4 w-4" />
              <span>QR</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="events">Eventos Médicos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 mt-4">
          <PetGeneralInfo pet={pet} />
          <PetQRPreview petId={pet.id} petName={pet.name} />
        </TabsContent>
        
        <TabsContent value="events" className="mt-4">
          <PetMedicalEvents 
            petId={pet.id} 
            petName={pet.name}
            events={medicalEvents || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetDetail;
