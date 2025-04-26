
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, PenSquare, Upload, Camera } from 'lucide-react';
import MedicalEventCard from './MedicalEventCard';
import { toast } from 'sonner';

interface PetMedicalEventsProps {
  petId: string;
  petName: string;
  events: Array<{
    id: string;
    pet_id: string;
    type: string;
    title: string;
    date: string;
    description?: string;
  }>;
}

const PetMedicalEvents = ({ petId, petName, events }: PetMedicalEventsProps) => {
  const navigate = useNavigate();
  
  const handleCameraClick = () => {
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment';
    
    cameraInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        // Navigate to add event with the file
        navigate(`/portal/pets/${petId}/add-event?method=camera`);
      }
    };
    
    cameraInput.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Historial Médico</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              <span>Nuevo evento</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0">
            <div className="flex flex-col">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none"
                asChild
              >
                <Link to={`/portal/pets/${petId}/add-event?method=manual`}>
                  <PenSquare className="mr-2 h-4 w-4" />
                  <span>Manual</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none"
                asChild
              >
                <Link to={`/portal/pets/${petId}/add-event?method=upload`}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Subir Foto</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none"
                onClick={handleCameraClick}
              >
                <Camera className="mr-2 h-4 w-4" />
                <span>Tomar Foto</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {events && events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <MedicalEventCard
              key={event.id}
              id={event.id}
              petId={event.pet_id}
              type={event.type}
              title={event.title}
              date={event.date}
              description={event.description}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <p className="text-muted-foreground mb-4">
              Aún no hay eventos médicos registrados para {petName}
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar primer evento
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none"
                    asChild
                  >
                    <Link to={`/portal/pets/${petId}/add-event?method=manual`}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      <span>Manual</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none"
                    asChild
                  >
                    <Link to={`/portal/pets/${petId}/add-event?method=upload`}>
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Subir Foto</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-none"
                    onClick={handleCameraClick}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    <span>Tomar Foto</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetMedicalEvents;
