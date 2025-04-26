
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WhatsappIcon } from '@/components/icons/WhatsappIcon';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PhoneVerificationProps {
  onVerified: (sessionData?: any) => void;
}

const PhoneVerification = ({ onVerified }: PhoneVerificationProps) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  const verificationComplete = useRef(false);
  
  // Verificar sesión existente solo una vez cuando el componente se monta
  useEffect(() => {
    const checkExistingSession = async () => {
      if (verificationComplete.current) return;
      
      console.log("PhoneVerification: Verificando sesión existente");
      
      // Primero verificar localStorage para una respuesta rápida
      const storedSession = localStorage.getItem('userSession');
      if (storedSession) {
        try {
          const parsedSession = JSON.parse(storedSession);
          if (new Date(parsedSession.expiresAt) > new Date()) {
            console.log("PhoneVerification: Sesión existente encontrada en localStorage:", parsedSession);
            verificationComplete.current = true;
            setTimeout(() => onVerified(parsedSession), 100);
            return;
          }
        } catch (error) {
          console.error("PhoneVerification: Error procesando sesión de localStorage:", error);
          localStorage.removeItem('userSession');
        }
      }
      
      // Luego verificar Supabase
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("PhoneVerification: Sesión existente encontrada en Supabase:", data.session);
        verificationComplete.current = true;
        onVerified(data.session);
      } else {
        console.log("PhoneVerification: No se encontró sesión existente");
      }
    };
    
    checkExistingSession();
  }, [onVerified]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+56${phone.replace(/\D/g, '')}`;
      
      console.log("PhoneVerification: Enviando solicitud para generar código:", formattedPhone);
      
      const response = await fetch('https://n8n.llaima.ai/webhook/securitycode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: formattedPhone }),
      });
      
      const data = await response.json();
      console.log("PhoneVerification: Respuesta recibida:", data);

      if (!response.ok) {
        console.error("PhoneVerification: Error al generar código:", data);
        throw new Error(data.message || 'Error al enviar el código');
      }

      if (data) {
        setStep('code');
        toast.success('Código enviado correctamente. Por favor verifica tu WhatsApp.');
      } else {
        toast.error('Error al enviar el código. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('PhoneVerification: Error:', error);
      toast.error('Error al enviar el código. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || verificationComplete.current) return;
    
    setIsSubmitting(true);
    setVerificationAttempted(true);
    
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+56${phone.replace(/\D/g, '')}`;
      
      console.log("PhoneVerification: Verificando código:", { phone: formattedPhone, code });
      
      const response = await supabase.functions.invoke('verify-code', {
        body: { 
          phone_number: formattedPhone, 
          code 
        },
      });
      
      console.log("PhoneVerification: Respuesta de verificación:", response);

      if (response.error) {
        console.error("PhoneVerification: Error al verificar código:", response.error);
        let errorMessage = 'Error al verificar el código';
        
        if (typeof response.error === 'string') {
          if (response.error.includes('Código incorrecto')) errorMessage = 'Código incorrecto';
        } else if (response.error.error) {
          errorMessage = response.error.error;
        }
        
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      if (response.data && response.data[0]) {
        const userData = response.data[0];
        console.log("PhoneVerification: Datos de usuario recibidos:", userData);
        
        // Crear una sesión personalizada que podamos usar en la aplicación
        const sessionData = {
          user: userData,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
        };
        
        // Guardar en localStorage para persistencia
        try {
          localStorage.setItem('userSession', JSON.stringify(sessionData));
          console.log("PhoneVerification: Sesión guardada en localStorage:", sessionData);
        } catch (err) {
          console.error("PhoneVerification: Error al guardar sesión en localStorage:", err);
        }
        
        toast.success('Verificación exitosa');
        
        // Marcar la verificación como completada para evitar múltiples llamadas
        verificationComplete.current = true;
        
        // Llamar a onVerified con los datos del usuario después de un pequeño retraso
        // para evitar carreras de condiciones
        setTimeout(() => {
          console.log("PhoneVerification: Llamando a onVerified con:", sessionData);
          if (verificationComplete.current) { // Verificación adicional
            onVerified(sessionData);
          }
        }, 500);
      } else {
        console.error("PhoneVerification: Respuesta sin datos de usuario:", response);
        toast.error('No se recibieron datos del usuario. Intenta nuevamente.');
      }
      
    } catch (error) {
      console.error('PhoneVerification: Error al verificar código:', error);
      toast.error('Error al verificar el código. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si ya se ha intentado verificar, no mostrar el formulario inmediatamente
  // para evitar parpadeos
  if (verificationAttempted) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse">
          <p className="text-center text-muted-foreground">Verificando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Ingresa tu teléfono</h2>
            <p className="text-muted-foreground mt-1">
              Te enviaremos un código por WhatsApp para verificar tu cuenta
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Número de teléfono</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground">
                +56
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="9 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <WhatsappIcon className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Enviando...' : 'Enviar código por WhatsApp'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Ingresa el código</h2>
            <p className="text-muted-foreground mt-1">
              Te enviamos un código de verificación al número +56 {phone}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Código de verificación</Label>
            <InputOTP maxLength={5} value={code} onChange={setCode}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verificando...' : 'Verificar código'}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setStep('phone')}
            disabled={isSubmitting}
          >
            Cambiar número de teléfono
          </Button>
        </form>
      )}
    </div>
  );
};

export default PhoneVerification;
