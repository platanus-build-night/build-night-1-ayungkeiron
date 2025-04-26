
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@/components/ui/card';

interface MedicalEventDetailProps {
  event: {
    id: string;
    type: string;
    title: string;
    date: string;
    description?: string;
    attachments?: string[] | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

const MedicalEventDetail = ({ event, isOpen, onClose }: MedicalEventDetailProps) => {
  const getEventLabel = () => {
    switch (event.type) {
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

  const getEventColor = () => {
    switch (event.type) {
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

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del Evento Médico</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className={`${getEventColor()} border-none p-4`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{event.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-white/70 backdrop-blur-sm">
                {getEventLabel()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(event.date), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
            {event.description && (
              <p className="mt-4 text-sm">{event.description}</p>
            )}
          </Card>

          {event.attachments && event.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Archivos adjuntos</h4>
              <div className="grid gap-2">
                {event.attachments.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Adjunto ${index + 1}`}
                    className="w-full rounded-lg border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalEventDetail;
