
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerifyCodeRequest {
  phone_number: string;
  code: string;
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

    const { phone_number, code } = requestData as VerifyCodeRequest;
    console.log("Datos recibidos:", { phone_number, code });

    // Validate input
    if (!phone_number || !code) {
      console.log("Error: Falta número de teléfono o código");
      return new Response(
        JSON.stringify({ error: 'Phone number and code are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    try {
      // Normalize the phone number if needed (remove prefixes like +56)
      let normalizedPhone = phone_number;
      if (phone_number.startsWith('+')) {
        normalizedPhone = phone_number.substring(1);
      }
      
      console.log("Número normalizado:", normalizedPhone);
      console.log("Llamando a la función verify_security_code");
      
      // Get raw record from database to avoid ambiguous column issues
      const { data: userData, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .eq('security_code', code)
        .single();
      
      console.log("Resultado de búsqueda:", { userData, fetchError });
      
      if (fetchError) {
        console.error("Error al buscar usuario:", fetchError);
        return new Response(
          JSON.stringify({ 
            error: 'Error al verificar código', 
            details: fetchError 
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      if (!userData) {
        console.log("No se encontró el usuario con ese código");
        return new Response(
          JSON.stringify({ error: 'Código incorrecto' }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Clear security code after successful verification
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({
          security_code: null,
          code_expires_at: null
        })
        .eq('id', userData.id);
      
      if (updateError) {
        console.error("Error al actualizar usuario:", updateError);
        // Continue anyway as the verification was successful
      }

      console.log("Verificación exitosa, usuario:", userData);

      // Return the user data
      return new Response(
        JSON.stringify([{
          id: userData.id,
          phone_number: userData.phone_number,
          name: userData.name,
          email: userData.email
        }]),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (rpcError) {
      console.error("Error al llamar RPC:", rpcError);
      return new Response(
        JSON.stringify({ 
          error: 'Error calling verification function', 
          details: rpcError instanceof Error ? rpcError.message : String(rpcError) 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (err) {
    console.error('Error completo en verify-code function:', err);
    
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
