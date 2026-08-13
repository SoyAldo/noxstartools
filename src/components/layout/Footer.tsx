import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-6 mt-auto bg-canvas border-t border-panel-border flex flex-col md:flex-row justify-between items-center px-6 gap-4 z-40 relative">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <span className="font-bold text-primary">NoxstarTools</span>
        <span className="text-gray-500 text-sm">© 2024 NoxstarTools. Sponsoreado por <Link to="https://noxstarstudios.com" target="_blank" rel="noopener noreferrer">Noxstar Studios</Link></span>
      </div>

      <div className="flex gap-6">
        <Link to="/legal" className="text-gray-400 hover:text-primary transition-colors text-sm">
          Términos
        </Link>
        <Link to="/legal" className="text-gray-400 hover:text-primary transition-colors text-sm">
          Privacidad
        </Link>
        <Link to="/legal" className="text-gray-400 hover:text-primary transition-colors text-sm">
          Cookies
        </Link>
      </div>
    </footer>
  );
}
