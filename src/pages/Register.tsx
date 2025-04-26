
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneVerification from '@/components/onboarding/PhoneVerification';
import PetForm, { PetFormValues } from '@/components/pets/PetForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'verification' | 'pet-info'>('verification');
  
  const handleVerificationComplete = () => {
    setStep('pet-info');
  };
  
  const handlePetFormSubmit = (data: PetFormValues) => {
    // In a real application, this would save the pet data
    console.log('Pet data:', data);
    
    // Navigate to the portal home page
    navigate('/portal');
  };
  
  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        {step === 'verification' ? (
          <>
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
            
            <PhoneVerification onVerified={handleVerificationComplete} />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setStep('verification')}
                className="flex items-center text-muted-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
              
              <h1 className="text-xl font-bold">Crea tu mascota</h1>
              
              <div className="w-10"></div> {/* Spacer for alignment */}
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Tu primera mascota</h2>
              <p className="text-muted-foreground mt-1">
                Agrega los datos básicos para crear la ficha
              </p>
            </div>
            
            <PetForm 
              onSubmit={handlePetFormSubmit}
            />
            
            <div className="mt-4 text-center">
              <Button 
                variant="link"
                onClick={() => navigate('/portal')}
                className="text-muted-foreground"
              >
                Omitir por ahora
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
