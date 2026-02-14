import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart, ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Product, Category } from '../types';
import { fetchProducts, fetchCategories } from '../services/supabaseService';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../lib/constants';
import ChatWidget from './ChatWidget';

interface StorefrontProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  useMockData: boolean;
}

// Fallback images for random assignment if image_url is missing
const RANDOM_CATEGORY_IMAGES = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400'
];

const getRandomImage = (index: number) => RANDOM_CATEGORY_IMAGES[index % RANDOM_CATEGORY_IMAGES.length];

// Sub-component for individual Product Card to manage Carousel State
const ProductCard: React.FC<{ product: Product; onAddToCart: (p: Product) => void; onViewProduct: (p: Product) => void }> = ({ product, onAddToCart, onViewProduct }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image_url];

  const hasMultipleImages = images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }

  // Calculate Discount Logic
  const hasPromo = product.promotional_price && product.promotional_price < product.price;
  const discountPercent = hasPromo ? Math.round(((product.price - (product.promotional_price || 0)) / product.price) * 100) : 0;
  const finalPrice = product.promotional_price || product.price;

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100 overflow-hidden flex flex-col relative h-full cursor-pointer"
      onClick={() => onViewProduct(product)}
    >
      {/* Image Area with Carousel */}
      <div className="relative h-72 overflow-hidden bg-gray-50 group-hover:scale-[1.01] transition duration-500">
        <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
            className="w-full h-full object-cover transition duration-700"
        />
        
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
            >
              <ChevronRight size={20} />
            </button>
            
            {/* Dots Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => goToImage(idx, e)}
                  className={`w-2 h-2 rounded-full transition-all shadow-sm ${
                    idx === currentImageIndex ? 'bg-primary w-4' : 'bg-white/70 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col gap-2 z-10">
            <button className="bg-white p-2 rounded-full shadow-lg text-gray-400 hover:text-red-500 transition"><Heart size={18} /></button>
            <button className="bg-white p-2 rounded-full shadow-lg text-gray-400 hover:text-blue-500 transition"><Eye size={18} /></button>
        </div>
        
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
            {product.featured && (
                <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wide">
                    Destaque
                </span>
            )}
            {hasPromo && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    -{discountPercent}% OFF
                </span>
            )}
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold opacity-60">{product.category}</div>
          <h3 className="font-bold text-lg text-gray-800 mb-2 leading-tight group-hover:text-primary transition">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <div className="flex flex-col">
                  {hasPromo && <span className="text-xs text-gray-400 line-through">R$ {product.price.toFixed(2)}</span>}
                  <span className={`text-xl font-bold ${hasPromo ? 'text-red-600' : 'text-gray-900'}`}>
                      R$ {finalPrice.toFixed(2)}
                  </span>
              </div>
              <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="bg-gray-900 text-white p-3 rounded-xl hover:bg-primary transition active:scale-95 shadow-md flex items-center gap-2"
              >
                  <ShoppingCart size={18} />
              </button>
          </div>
      </div>
    </div>
  );
};

const Storefront: React.FC<StorefrontProps> = ({ onAddToCart, onViewProduct, useMockData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (useMockData) {
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
      } else {
        const prodData = await fetchProducts();
        const catData = await fetchCategories();
        
        if (prodData.length === 0) setProducts(INITIAL_PRODUCTS);
        else setProducts(prodData);

        if (catData.length === 0) setCategories(INITIAL_CATEGORIES);
        else setCategories(catData);
      }
      setLoading(false);
    };
    loadData();
  }, [useMockData]);

  // Colors for category backgrounds
  const BG_COLORS = ['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-green', 'bg-pastel-yellow'];

  return (
    <div className="pb-20 bg-white">
      {/* 1. Main Hero Banner */}
      <div className="relative h-[85vh] bg-pastel-pink overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?auto=format&fit=crop&q=80&w=1600" 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center max-w-6xl">
            <span className="text-primary font-bold tracking-widest uppercase mb-4 animate-fade-in">Nova Coleção 2025</span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-gray-900 mb-6 leading-tight animate-slide-in-right">
                Inspire sua <br/> <span className="text-primary italic">Criatividade</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-xl animate-fade-in delay-100">
                Os melhores materiais de papelaria para organizar seus sonhos e colorir sua rotina.
            </p>
            <div className="flex gap-4 animate-fade-in delay-200">
                <button className="bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-gray-800 transition transform hover:-translate-y-1 flex items-center gap-2">
                    Comprar Agora <ArrowRight size={20} />
                </button>
                <button className="bg-white text-gray-800 px-10 py-4 rounded-full font-bold shadow-lg hover:bg-gray-50 transition transform hover:-translate-y-1">
                    Ver Catálogo
                </button>
            </div>
        </div>
      </div>

      {/* 2. Categories Section (Dynamic) */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-12">Navegue por Categorias</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {categories.map((cat, idx) => {
                // If no image, pick random. If image exists, use it.
                const imgUrl = cat.image_url && cat.image_url.length > 5 ? cat.image_url : getRandomImage(idx);
                const bgColor = BG_COLORS[idx % BG_COLORS.length];
                
                return (
                <div key={cat.id || idx} className="group cursor-pointer flex flex-col items-center gap-4">
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary transition duration-300 shadow-lg ${bgColor} relative`}>
                         <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-90" />
                    </div>
                    <span className="font-bold text-lg text-gray-700 group-hover:text-primary transition">{cat.name}</span>
                </div>
            )})}
        </div>
      </section>

      {/* 3. Featured/Highlight Banner */}
      <section className="py-16 bg-pastel-blue/30 my-10">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="md:w-1/2">
                 <span className="bg-white text-blue-600 px-4 py-1 rounded-full text-sm font-bold shadow-sm mb-4 inline-block">Edição Limitada</span>
                 <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Kit Planner Essencial</h2>
                 <p className="text-gray-600 mb-8 text-lg">Tudo o que você precisa para começar o ano com o pé direito. Planner, canetas e adesivos exclusivos.</p>
                 <button className="text-primary font-bold border-b-2 border-primary pb-1 hover:text-gray-800 hover:border-gray-800 transition">Conferir Detalhes</button>
              </div>
              <div className="md:w-1/2 relative">
                  <div className="absolute inset-0 bg-white/50 rounded-full filter blur-3xl transform scale-75"></div>
                  <img src="https://images.unsplash.com/photo-1506784926709-b2f9752fc184?auto=format&fit=crop&q=80&w=800" alt="Destaque" className="relative z-10 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition duration-500 max-h-80 object-cover w-full" />
              </div>
          </div>
      </section>

      {/* 4. Best Selling Products */}
      <div className="container mx-auto px-6 py-10" id="produtos">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-800">Mais Vendidos</h2>
                <p className="text-gray-500 mt-2">Os queridinhos da nossa comunidade</p>
            </div>
            <button className="text-primary font-bold hover:underline">Ver tudo</button>
        </div>

        {loading ? (
             <div className="text-center py-20 text-gray-500">Carregando produtos mágicos...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewProduct={onViewProduct} />
            ))}
            </div>
        )}
      </div>

      {/* Chat Widget Replaces Simple Link */}
      <ChatWidget />

      {/* Footer Simple */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <div className="text-2xl font-serif font-bold mb-4">Papelaria Encantada</div>
                  <p className="text-gray-400 text-sm">Levando cor e organização para sua vida desde 2023.</p>
              </div>
              <div>
                  <h4 className="font-bold mb-4">Ajuda</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                      <li>Entrega e Frete</li>
                      <li>Trocas e Devoluções</li>
                      <li>Fale Conosco</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4">Sobre</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                      <li>Nossa História</li>
                      <li>Blog</li>
                      <li>Carreiras</li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold mb-4">Newsletter</h4>
                  <div className="flex bg-gray-800 rounded p-1">
                      <input type="email" placeholder="Seu e-mail" className="bg-transparent px-2 w-full outline-none text-sm" />
                      <button className="bg-primary px-4 py-2 rounded text-xs font-bold">OK</button>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Storefront;