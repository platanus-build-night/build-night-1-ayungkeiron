
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PetQRPreviewProps {
  petId: string;
  petName: string;
}

const PetQRPreview = ({ petId, petName }: PetQRPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Código QR</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="qr-container mb-4">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://dogtrackcare.com/pet/${petId}`)}`}
            alt={`QR de ${petName}`}
            className="w-32 h-32"
          />
        </div>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to={`/portal/pets/${petId}/qr`} className="flex items-center justify-center gap-1">
            <QrCode className="h-4 w-4" />
            <span>Ver código QR</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PetQRPreview;
