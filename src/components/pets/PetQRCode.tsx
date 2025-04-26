
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface PetQRCodeProps {
  petId: string;
  petName: string;
}

const PetQRCode = ({ petId, petName }: PetQRCodeProps) => {
  // This is a placeholder for the QR code image
  // In a real application, we would generate this using a QR code library
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://dogtrackcare.com/pet/${petId}`)}`;
  
  const handleDownload = () => {
    // In a real application, this would download the QR code
    alert("En una aplicación real, aquí descargarías el código QR");
  };
  
  const handleShare = () => {
    // In a real application, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `Ficha de ${petName} - DogTrackCare`,
        text: `Aquí está la ficha médica de ${petName}`,
        url: `https://dogtrackcare.com/pet/${petId}`,
      }).catch(console.error);
    } else {
      alert("Tu navegador no soporta la función de compartir");
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="qr-container">
        <img 
          src={qrImageUrl} 
          alt={`Código QR para ${petName}`} 
          className="w-52 h-52"
        />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-medium">Código QR de {petName}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Escanea este código para acceder a la ficha médica
        </p>
      </div>
      
      <div className="flex gap-4 w-full max-w-xs">
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Descargar
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 gap-2"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </div>
    </div>
  );
};

export default PetQRCode;
