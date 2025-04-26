
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateCodeRequest {
  phone_number: string;
}

// Función para normalizar números de teléfono
function normalizePhoneNumber(phone: string): string {
  // Eliminar cualquier carácter que no sea dígito
  let cleaned = phone.replace(/\D/g, '');
  
  // Si el número comienza con 56, dejarlo así
  // Si no, agregar el prefijo 56
  if (!cleaned.startsWith('56')) {
    cleaned = '56' + cleaned.replace(/^0/, '');
  }
  
  return cleaned;
}

// Función para generar un código de seguridad aleatorio de 5 dígitos
function generateSecurityCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

serve(async (req) => {
  console.log("Handler iniciado:", new Date().toISOString());
  console.log("Método de la solicitud:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Respondiendo a solicitud OPTIONS");
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Creando cliente Supabase");
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log("URLs de Supabase:", { 
      url: supabaseUrl ? "definida" : "no definida", 
      key: supabaseAnonKey ? "definida" : "no definida" 
    });
    
    const supabaseClient = createClient(
      supabaseUrl ?? '',
      supabaseAnonKey ?? ''
    );

    // Parse request body
    let requestData;
    try {
      console.log("Analizando cuerpo de la solicitud");
      const text = await req.text();
      console.log("Texto recibido:", text);
      
      if (!text || text.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Empty request body' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      requestData = JSON.parse(text);
    } catch (parseError) {
      console.error("Error al parsear JSON:", parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', details: parseError.message }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { phone_number } = requestData as GenerateCodeRequest;
    console.log("Número de teléfono recibido:", phone_number);

    // Validate input
    if (!phone_number) {
      console.log("Error: falta número de teléfono");
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Normalizar el número de teléfono
    const normalizedPhoneNumber = normalizePhoneNumber(phone_number);
    console.log("Número normalizado:", normalizedPhoneNumber);

    // Generar código de seguridad localmente (5 dígitos)
    const securityCode = generateSecurityCode();
    console.log("Código de seguridad generado:", securityCode);

    // Try to find existing user
    console.log("Buscando usuario existente");
    const { data: existingUser, error: selectError } = await supabaseClient
      .from('users')
      .select()
      .eq('phone_number', normalizedPhoneNumber)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error("Error al buscar usuario:", selectError);
      return new Response(
        JSON.stringify({ error: 'Error finding user', details: selectError }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Usuario existente:", existingUser ? "Sí" : "No");
    let result;
    
    try {
      if (existingUser) {
        // Update existing user's code
        console.log("Actualizando código para usuario existente");
        const { data, error } = await supabaseClient
          .from('users')
          .update({
            security_code: securityCode,
            code_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
          })
          .eq('phone_number', normalizedPhoneNumber)
          .select()
          .single();

        if (error) {
          console.error("Error al actualizar usuario:", error);
          throw error;
        }
        result = data;
        console.log("Usuario actualizado correctamente");
      } else {
        // Create new user with code
        console.log("Creando nuevo usuario");
        const { data, error } = await supabaseClient
          .from('users')
          .insert({
            phone_number: normalizedPhoneNumber,
            security_code: securityCode,
            code_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error("Error al crear usuario:", error);
          throw error;
        }
        result = data;
        console.log("Nuevo usuario creado correctamente");
      }
    } catch (dbError) {
      console.error("Error en operación de base de datos:", dbError);
      return new Response(
        JSON.stringify({ error: 'Database operation failed', details: dbError }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the phone number and generated code
    console.log("Enviando respuesta exitosa");
    return new Response(
      JSON.stringify({
        phone_number: result.phone_number,
        security_code: result.security_code
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error('Error completo en generate-code function:', err);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
