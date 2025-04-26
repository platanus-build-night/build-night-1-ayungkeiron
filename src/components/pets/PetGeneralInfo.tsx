
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog, Cat } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PetGeneralInfoProps {
  pet: {
    name: string;
    species: string;
    breed?: string | null;
    birth_date?: string;
    gender?: string;
    color?: string;
    weight?: number;
    sterilized: boolean;
    microchip?: string;
    allergies?: string;
  };
}

const PetGeneralInfo = ({ pet }: PetGeneralInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Nombre:</span>
          <span className="font-medium">{pet.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Especie:</span>
          <div className="flex items-center gap-2">
            {pet.species === 'Perro' ? <Dog className="h-4 w-4" /> : <Cat className="h-4 w-4" />}
            <span className="font-medium">{pet.species === 'Perro' ? 'Perro' : 'Gato'}</span>
          </div>
        </div>
        {pet.breed && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Raza:</span>
            <span className="font-medium">{pet.breed}</span>
          </div>
        )}
        {pet.birth_date && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha de nacimiento:</span>
            <span className="font-medium">
              {format(new Date(pet.birth_date), 'PP', { locale: es })}
            </span>
          </div>
        )}
        {pet.gender && pet.gender !== 'unknown' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sexo:</span>
            <span className="font-medium">
              {pet.gender === 'male' ? 'Macho' : 'Hembra'}
            </span>
          </div>
        )}
        {pet.color && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Color:</span>
            <span className="font-medium">{pet.color}</span>
          </div>
        )}
        {pet.weight && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Peso:</span>
            <span className="font-medium">{pet.weight} kg</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Esterilizado:</span>
          <span className="font-medium">{pet.sterilized ? 'Sí' : 'No'}</span>
        </div>
        {pet.microchip && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Microchip:</span>
            <span className="font-medium">{pet.microchip}</span>
          </div>
        )}
        {pet.allergies && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Alergias:</span>
            <span className="font-medium">{pet.allergies}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PetGeneralInfo;
