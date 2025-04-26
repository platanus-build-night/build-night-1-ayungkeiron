
import { useState } from 'react';
import { toast } from 'sonner';
import type { EventFormValues } from '@/components/medical-events/ManualEntryForm';

export const useImageProcessing = (
  setCurrentImage: (file: File | null) => void,
  setPreFilledData: (data: Partial<EventFormValues> | null) => void,
  setSelectedMethod: (method: 'manual' | 'upload' | 'camera') => void
) => {
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const processImageWithAI = async (file: File): Promise<Partial<EventFormValues>> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      type: 'vaccine' as const,
      title: 'Vacuna antirrábica',
      date: new Date().toISOString().split('T')[0],
      description: 'Vacuna anual contra la rabia aplicada en la clínica veterinaria.'
    };
  };

  const handleImageUpload = async (file: File) => {
    setIsProcessingImage(true);
    try {
      setCurrentImage(file);
      
      const extractedData = await processImageWithAI(file);
      
      setPreFilledData(extractedData);
      setSelectedMethod('manual');
      
      toast.success('Imagen procesada correctamente');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error al procesar la imagen');
      setSelectedMethod('manual');
    } finally {
      setIsProcessingImage(false);
    }
  };

  return {
    isProcessingImage,
    handleImageUpload
  };
};
