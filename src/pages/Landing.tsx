import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Shield, Heart, FileImage, Camera, FileSearch, ArrowRight, Search, Tag, Dog } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-8 md:py-16 bg-gradient-to-b from-brand-soft-purple to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-3 max-w-[800px]">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Digitaliza la salud de tu mascota con <span className="text-brand-purple">DogTrackCare </span>
              </h1>
              <p className="text-gray-500 md:text-lg">
                Toma una foto de los documentos del veterinario y nuestra IA los transformará en una ficha médica digital inteligente, fácil de leer y accesible desde cualquier lugar
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 min-w-[200px] py-8">
              <Button asChild size="lg" className="gap-2">
                <Link to="/signin">
                  Crea la ficha de tu mascota
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/scan">Escanear un QR</Link>
              </Button>
            </div>
            
            <div className="mt-[60px] grid grid-cols-1 md:grid-cols-3 gap-4 text-left w-full max-w-3xl">
              <div className="flex items-start gap-3 bg-white/80 backdrop-blur p-4 rounded-lg">
                <FileImage className="h-6 w-6 text-brand-purple shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">Sube tus documentos</h3>
                  <p className="text-sm text-gray-500">Escanea o fotografía los documentos del veterinario</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 backdrop-blur p-4 rounded-lg">
                <Search className="h-6 w-6 text-brand-purple shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">IA los analiza</h3>
                  <p className="text-sm text-gray-500">Convertimos los documentos en información organizada</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 backdrop-blur p-4 rounded-lg">
                <QrCode className="h-6 w-6 text-brand-purple shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium">QR único</h3>
                  <p className="text-sm text-gray-500">Accede a la ficha médica desde cualquier dispositivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold">¿Cómo funciona?</h2>
            <p className="mt-2 text-muted-foreground max-w-[700px] mx-auto">
              DogTrackCare te brinda todo lo que necesitas para cuidar la salud de tu mascota
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-brand-soft-purple mb-4">
                <Camera className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-xl font-medium mb-2">Sube documentos</h3>
              <p className="text-muted-foreground">
                Toma fotos de los documentos del veterinario, recetas o certificados
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-brand-green mb-4">
                <FileSearch className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="text-xl font-medium mb-2">IA Transforma</h3>
              <p className="text-muted-foreground">
                Nuestra inteligencia artificial convierte los documentos en una ficha médica digital inteligente
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="p-3 rounded-full bg-brand-soft-peach mb-4">
                <QrCode className="h-6 w-6 text-orange-700" />
              </div>
              <h3 className="text-xl font-medium mb-2">Código QR único</h3>
              <p className="text-muted-foreground">
                Cada mascota recibe un código QR que permite acceder rápidamente a su información médica
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold">Comienza en minutos</h2>
            <p className="mt-2 text-muted-foreground max-w-[700px] mx-auto">
              Crear la ficha de tu mascota es rápido y sencillo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple text-white font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Regístrate</h3>
              <p className="text-muted-foreground">
                Verifica tu número de teléfono con un simple código por WhatsApp
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple text-white font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">Crea la ficha</h3>
              <p className="text-muted-foreground">
                Agrega los datos básicos de tu mascota y personaliza su perfil
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-purple text-white font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Obtén el QR</h3>
              <p className="text-muted-foreground">
                Descarga el código QR para imprimirlo o solicita una placa para collar
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link to="/register">
                Crear ficha de mi mascota
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl md:text-4xl font-bold">Obtén una placa física</h2>
              <p className="text-white/90">
                Además del código QR digital, puedes solicitar una placa física para el collar de tu mascota
              </p>
              <Button asChild variant="secondary">
                <Link to="/register">
                  <Tag className="mr-2 h-4 w-4" />
                  Quiero una placa con QR
                </Link>
              </Button>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
                <div className="aspect-square w-64 h-64 mx-auto rounded-md overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Perro con placa de identificación" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
