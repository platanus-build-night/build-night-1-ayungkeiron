
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
  type: z.enum(['vaccine', 'surgery', 'emergency', 'checkup', 'other']),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  date: z.string(),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

interface ManualEntryFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  isSubmitting?: boolean;
  imagePreview?: string;
  readOnly?: boolean;
}

export const ManualEntryForm = ({ 
  defaultValues,
  onSubmit, 
  isSubmitting = false,
  imagePreview,
  readOnly = false
}: ManualEntryFormProps) => {
  console.log('ManualEntryForm defaultValues:', defaultValues);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'checkup',
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      ...defaultValues
    },
  });
  
  // Log when form values are set
  console.log('Form values after initialization:', form.getValues());
  
  // Aplicar los valores predeterminados cuando cambian
  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach(key => {
        const fieldKey = key as keyof EventFormValues;
        const value = defaultValues[fieldKey];
        if (value !== undefined) {
          form.setValue(fieldKey, value);
        }
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {imagePreview && !readOnly && (
          <div className="mb-6">
            <img 
              src={imagePreview} 
              alt="Vista previa" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de evento</FormLabel>
              {readOnly ? (
                <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
                  {(() => {
                    switch(field.value) {
                      case 'vaccine': return 'Vacuna';
                      case 'surgery': return 'Cirugía';
                      case 'emergency': return 'Emergencia';
                      case 'checkup': return 'Control';
                      default: return 'Otro';
                    }
                  })()}
                </div>
              ) : (
                <>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value} 
                    disabled={readOnly}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vaccine">Vacuna</SelectItem>
                      <SelectItem value="surgery">Cirugía</SelectItem>
                      <SelectItem value="emergency">Emergencia</SelectItem>
                      <SelectItem value="checkup">Control</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              {readOnly ? (
                <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
                  {field.value}
                </div>
              ) : (
                <>
                  <FormControl>
                    <Input placeholder="Ej: Vacuna antirrábica" {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              {readOnly ? (
                <div className="px-3 py-2 bg-muted rounded-md text-muted-foreground">
                  {field.value}
                </div>
              ) : (
                <>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción{!readOnly && " (opcional)"}</FormLabel>
              {readOnly ? (
                <div className="px-3 py-2 bg-muted rounded-md min-h-[100px] text-muted-foreground whitespace-pre-wrap">
                  {field.value || "Sin descripción"}
                </div>
              ) : (
                <>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalles adicionales..." 
                      className="min-h-[100px]" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            </FormItem>
          )}
        />
        
        {!readOnly && (
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar evento'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};
