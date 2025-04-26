
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanLine } from 'lucide-react';

const ScanQR = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Escanear QR</h1>
          <p className="text-muted-foreground mt-1">
            Escanea un código QR de DogTrackCare para ver la información de la mascota
          </p>
        </div>
        
        <div className="aspect-square max-w-xs mx-auto border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4">
          <div className="bg-muted/50 rounded-full p-4">
            <ScanLine className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mt-4 text-center">
            La cámara se activará automáticamente para escanear un código QR
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            (Este es un ejemplo, en una aplicación real se usaría la cámara)
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate('/pet/pet1')}
            className="w-full"
          >
            Simular escaneo exitoso
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            También puedes ingresar manualmente el código de la mascota:
          </p>
          
          <div className="flex gap-2 mt-2">
            <input 
              type="text"
              placeholder="Ej: DTC-123456"
              className="flex-1 px-3 py-2 border border-input rounded-md"
            />
            <Button variant="outline">Buscar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanQR;
