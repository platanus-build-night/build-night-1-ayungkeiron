
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EventInputMethod } from '@/components/medical-events/EventInputMethod';
import { ManualEntryForm, type EventFormValues } from '@/components/medical-events/ManualEntryForm';
import { ImageUpload } from '@/components/medical-events/ImageUpload';
import { EventFormSkeleton } from '@/components/medical-events/EventFormSkeleton';
import { useMedicalEvent } from '@/hooks/useMedicalEvent';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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

const AddMedicalEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';
  const eventId = searchParams.get('eventId');
  const initialMethod = searchParams.get('method') as 'manual' | 'upload' | 'camera' | null;
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'upload' | 'camera'>(initialMethod || 'manual');
  const [preFilledData, setPreFilledData] = useState<Partial<EventFormValues> | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(isEditMode);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    eventData,
    isEventLoading,
    createMedicalEvent,
    deleteMedicalEvent,
    currentImage,
    setCurrentImage,
    imageUrl,
    setImageUrl
  } = useMedicalEvent(id, eventId);

  const { isProcessingImage, handleImageUpload } = useImageProcessing(
    setCurrentImage,
    setPreFilledData,
    setSelectedMethod
  );

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

  useEffect(() => {
    if (eventData) {
      console.log('Setting prefilled data from eventData:', eventData);
      setPreFilledData({
        type: eventData.type as any,
        title: eventData.title,
        date: eventData.date,
        description: eventData.description || ''
      });
      
      if (eventData.attachments && eventData.attachments.length > 0) {
        setImageUrl(eventData.attachments[0]);
      }
    }
  }, [eventData]);

  useEffect(() => {
    if (initialMethod === 'camera') {
      const cameraInput = document.createElement('input');
      cameraInput.type = 'file';
      cameraInput.accept = 'image/*';
      cameraInput.capture = 'environment';
      
      cameraInput.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          try {
            await handleImageUpload(file);
          } catch (error) {
            console.error('Error processing camera image:', error);
            toast.error('Error al procesar la imagen', {
              description: 'Por favor intenta de nuevo'
            });
          }
        }
      };
      
      cameraInput.click();
    }
  }, [initialMethod]);

  const downloadImage = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${pet?.name || 'mascota'}_${new Date().toISOString().split('T')[0]}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleGoBack = () => {
    navigate(`/portal/pets/${id}?tab=events`);
  };

  if (isPetLoading || isEventLoading) {
    return <EventFormSkeleton onBack={handleGoBack} />;
  }

  if (!pet) {
    navigate('/portal/pets');
    return null;
  }

  const pageTitle = isEditMode ? 'Ver evento médico' : 'Nuevo evento médico';

  return (
    <div className="max-w-md mx-auto pb-16">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">para {pet.name}</p>
        </div>
        
        {isEditMode && (
          <Button 
            variant="outline" 
            onClick={() => setIsReadOnly(false)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        )}
      </div>

      {!isEditMode && (
        <EventInputMethod 
          selectedMethod={selectedMethod}
          onMethodChange={(method) => {
            setSelectedMethod(method);
            setPreFilledData(null);
            setCurrentImage(null);
            
            if (method === 'camera') {
              const cameraInput = document.createElement('input');
              cameraInput.type = 'file';
              cameraInput.accept = 'image/*';
              cameraInput.capture = 'environment';
              
              cameraInput.onchange = async (e: Event) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) {
                  try {
                    await handleImageUpload(file);
                  } catch (error) {
                    console.error('Error processing camera image:', error);
                    toast.error('Error al procesar la imagen', {
                      description: 'Por favor intenta de nuevo'
                    });
                  }
                }
              };
              
              cameraInput.click();
            }
          }}
        />
      )}

      {(selectedMethod === 'manual' || isEditMode) && (
        <>
          {imageUrl && (
            <div className="mb-6 relative">
              <img 
                src={imageUrl} 
                alt="Imagen del evento" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button 
                variant="secondary" 
                size="sm"
                className="absolute bottom-2 right-2 flex items-center gap-1"
                onClick={downloadImage}
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          )}

          <ManualEntryForm 
            onSubmit={(data) => {
              try {
                createMedicalEvent.mutate(data);
              } catch (error) {
                console.error('Error submitting form:', error);
              }
            }}
            isSubmitting={createMedicalEvent.isPending}
            defaultValues={preFilledData || undefined}
            imagePreview={currentImage ? URL.createObjectURL(currentImage) : undefined}
            readOnly={isReadOnly}
          />

          {!isReadOnly && isEditMode && (
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar evento
            </Button>
          )}
        </>
      )}

      {(selectedMethod === 'upload' || selectedMethod === 'camera') && !isEditMode && (
        <ImageUpload 
          method={selectedMethod}
          onImageSelected={handleImageUpload}
          isProcessing={isProcessingImage}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El evento médico será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMedicalEvent.mutate();
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

export default AddMedicalEvent;
