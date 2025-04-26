
import React from 'react';
import { Button } from '@/components/ui/button';
import { PenSquare, Upload, Camera } from 'lucide-react';

type InputMethod = 'manual' | 'upload' | 'camera';

interface EventInputMethodProps {
  selectedMethod: InputMethod;
  onMethodChange: (method: InputMethod) => void;
}

export const EventInputMethod = ({ selectedMethod, onMethodChange }: EventInputMethodProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Button
        variant={selectedMethod === 'manual' ? 'default' : 'outline'}
        onClick={() => onMethodChange('manual')}
        className="w-full"
      >
        <PenSquare className="mr-2 h-4 w-4" />
        <span>Manual</span>
      </Button>
      
      <Button
        variant={selectedMethod === 'upload' ? 'default' : 'outline'}
        onClick={() => onMethodChange('upload')}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        <span>Subir Foto</span>
      </Button>
      
      <Button
        variant={selectedMethod === 'camera' ? 'default' : 'outline'}
        onClick={() => onMethodChange('camera')}
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" />
        <span>Tomar Foto</span>
      </Button>
    </div>
  );
};
