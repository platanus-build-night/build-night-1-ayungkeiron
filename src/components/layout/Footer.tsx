
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 bg-gray-50 border-t border-gray-200">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="text-sm text-gray-500">
            © {currentYear} DogTrackCare. Todos los derechos reservados.
          </div>
          
          <div className="flex gap-4">
            <Link to="/terminos" className="text-sm text-gray-500 hover:text-brand-purple">
              Términos de Servicio
            </Link>
            <Link to="/privacidad" className="text-sm text-gray-500 hover:text-brand-purple">
              Política de Privacidad
            </Link>
            <a href="mailto:contacto@dogtrackcare.com" className="text-sm text-gray-500 hover:text-brand-purple">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
