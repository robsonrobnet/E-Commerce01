import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Page, CartItem } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate(Page.STORE)}>
          <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-serif font-bold text-lg">P</div>
          <span className={`font-serif font-bold text-xl ${scrolled ? 'text-primary' : 'text-gray-800'}`}>
            Papelaria Encantada
          </span>
        </div>

        {/* Center Menu */}
        <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-sm px-8 py-2 rounded-full shadow-sm border border-white/20">
          <button onClick={() => onNavigate(Page.STORE)} className="text-sm font-bold text-gray-700 hover:text-primary transition">Início</button>
          <button className="text-sm font-medium text-gray-600 hover:text-primary transition">Cadernos</button>
          <button className="text-sm font-medium text-gray-600 hover:text-primary transition">Escrita</button>
          <button className="text-sm font-medium text-gray-600 hover:text-primary transition">Planners</button>
          <button className="text-sm font-medium text-gray-600 hover:text-primary transition">Presentes</button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className={`p-2 rounded-full hover:bg-black/5 transition ${scrolled ? 'text-gray-600' : 'text-gray-800'}`}>
            <Search size={20} />
          </button>
          
          <button 
            onClick={() => onNavigate(Page.LOGIN)}
            className={`p-2 rounded-full hover:bg-black/5 transition ${scrolled ? 'text-gray-600' : 'text-gray-800'}`}
            title="Área Administrativa"
          >
            <User size={20} />
          </button>

          <button 
            onClick={onOpenCart}
            className="relative bg-primary text-white p-3 rounded-full hover:bg-opacity-90 transition shadow-lg group"
          >
            <ShoppingBag size={20} className="group-hover:scale-110 transition" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;