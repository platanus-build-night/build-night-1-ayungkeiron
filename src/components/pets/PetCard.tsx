
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Edit, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ImageUpload } from '@/components/medical-events/ImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface PetCardProps {
  id: string;
  name: string;
  species?: 'Perro' | 'Gato' | null;
  breed?: string | null;
  photoUrl?: string | null;
}

const PetCard = ({ id, name, species, breed, photoUrl }: PetCardProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState(photoUrl);
  const { user } = useAuth();

  const handleImageSelected = async (file: File, method: 'upload' | 'camera') => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión para subir una foto');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}-${Math.random()}.${fileExt}`;
      const filePath = `${id}/${fileName}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      // Update pet photo_url in database
      const { error: updateError } = await supabase
        .from('pets')
        .update({ photo_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setLocalPhotoUrl(publicUrl);

      toast.success(`Foto ${method === 'upload' ? 'subida' : 'tomada'} exitosamente`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('No se pudo subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <div 
            className="h-32 bg-gradient-to-br from-brand-soft-purple to-brand-purple-light"
            style={{
              backgroundImage: localPhotoUrl ? `url(${localPhotoUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!localPhotoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={species === 'Perro' ? '/dog-silhouette.svg' : '/cat-silhouette.svg'} 
                  alt={name}
                  className="w-16 h-16 opacity-70"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 bg-white/70 backdrop-blur-sm hover:bg-white"
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Subir foto</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Subir foto de {name}</DialogTitle>
                </DialogHeader>
                <ImageUpload 
                  method="upload"
                  onImageSelected={(file) => handleImageSelected(file, 'upload')}
                  isProcessing={isUploading}
                />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 bg-white/70 backdrop-blur-sm hover:bg-white"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Tomar foto</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Tomar foto de {name}</DialogTitle>
                </DialogHeader>
                <ImageUpload 
                  method="camera"
                  onImageSelected={(file) => handleImageSelected(file, 'camera')}
                  isProcessing={isUploading}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              asChild
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white/70 backdrop-blur-sm hover:bg-white"
            >
              <Link to={`/portal/pets/${id}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
            
            <Button 
              asChild
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white/70 backdrop-blur-sm hover:bg-white"
            >
              <Link to={`/portal/pets/${id}/qr`}>
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Ver QR</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <Link to={`/portal/pets/${id}`} className="block">
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm">
              {species || 'Mascota'}
              {breed ? ` · ${breed}` : ''}
            </p>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;
