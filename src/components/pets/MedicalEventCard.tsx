
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface MedicalEventProps {
  id: string;
  petId: string;
  type: string;
  date: string;
  title: string;
  description?: string;
  attachments?: string[];
}

const MedicalEventCard = ({ id, petId, type, date, title, description, attachments }: MedicalEventProps) => {
  const navigate = useNavigate();

  const getEventColor = () => {
    switch (type) {
      case 'vaccine':
        return 'bg-brand-green';
      case 'surgery':
        return 'bg-brand-soft-orange';
      case 'emergency':
        return 'bg-red-100';
      case 'checkup':
        return 'bg-brand-soft-blue';
      default:
        return 'bg-gray-100';
    }
  };

  const getEventLabel = () => {
    switch (type) {
      case 'vaccine':
        return 'Vacuna';
      case 'surgery':
        return 'Cirugía';
      case 'emergency':
        return 'Emergencia';
      case 'checkup':
        return 'Control';
      default:
        return 'Otro';
    }
  };

  const handleCardClick = () => {
    // Navegar a la página de edición de evento con los parámetros necesarios
    navigate(`/portal/pets/${petId}/add-event?edit=true&eventId=${id}&from=events`);
  };

  return (
    <Card 
      className={`${getEventColor()} border-none cursor-pointer transition-transform hover:scale-[1.02]`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <span className="text-xs px-2 py-1 rounded-full bg-white/70 backdrop-blur-sm">
            {getEventLabel()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span>{formatDate(date)}</span>
        </div>
        {description && <p className="text-sm line-clamp-2">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default MedicalEventCard;
