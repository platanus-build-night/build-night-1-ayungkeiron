
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  method: 'upload' | 'camera';
  onImageSelected: (file: File) => Promise<void>;
  isProcessing?: boolean;
}

export const ImageUpload = ({ method, onImageSelected, isProcessing = false }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      await onImageSelected(file);
    } catch (error) {
      console.error('Error selecting image:', error);
      toast.error('Error al procesar la imagen', {
        description: 'Por favor intenta de nuevo'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="text-center p-8 border-2 border-dashed rounded-lg">
      <input
        type="file"
        accept="image/*"
        capture={method === 'camera' ? 'environment' : undefined}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button 
        onClick={handleFileSelection} 
        variant="outline" 
        className="w-full"
        disabled={isProcessing || isUploading}
      >
        {isProcessing || isUploading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Procesando imagen...</span>
          </div>
        ) : method === 'camera' ? (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Tomar foto
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Seleccionar imagen
          </>
        )}
      </Button>
    </div>
  );
};
