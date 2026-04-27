import React, { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Heart, ArrowRight, ChevronLeft, ChevronRight, Eye, Truck, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Product, Category } from '../types';
import { fetchProducts, fetchCategories } from '../services/supabaseService';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../lib/constants';
import ChatWidget from './ChatWidget';
import { formatCurrency } from '../lib/utils';

interface StorefrontProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  useMockData: boolean;
}

// Shipping Bar Component
const ShippingBar: React.FC = () => {
  const benefits = [
    { icon: <Truck size={14} />, text: 'Frete grátis acima de R$ 150' },
    { icon: <RefreshCw size={14} />, text: 'Troca fácil' },
    { icon: <ShieldCheck size={14} />, text: 'Pagamento 100% Seguro' },
    { icon: <Sparkles size={14} />, text: 'Produtos Exclusivos' },
  ];

  return (
    <div className="bg-primary-900 text-white overflow-hidden py-2 hidden md:block">
      <div className="container mx-auto px-6 flex justify-around items-center gap-8">
        {benefits.map((b, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold"
          >
            <span className="text-accent">{b.icon}</span>
            {b.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ... existing RANDOM_CATEGORY_IMAGES and getRandomImage ...

// Improved Product Card with Framer Motion
const ProductCard: React.FC<{ product: Product; onAddToCart: (p: Product) => void; onViewProduct: (p: Product) => void; index: number }> = ({ product, onAddToCart, onViewProduct, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image_url];

  const hasMultipleImages = images.length > 1;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const hasPromo = product.promotional_price && product.promotional_price < product.price;
  const discountPercent = hasPromo ? Math.round(((product.price - (product.promotional_price || 0)) / product.price) * 100) : 0;
  const finalPrice = product.promotional_price || product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col relative h-full cursor-pointer"
      onClick={() => onViewProduct(product)}
    >
      <div className="relative h-80 overflow-hidden bg-gray-50">
        <motion.img 
            key={currentImageIndex}
            initial={{ opacity: 0.8, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={images[currentImageIndex]} 
            alt={product.name} 
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        
        {hasMultipleImages && (
          <>
            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition z-10"><ChevronLeft size={16} /></button>
            <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition z-10"><ChevronRight size={16} /></button>
          </>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.featured && <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase">Destaque</span>}
            {hasPromo && <span className="bg-accent text-primary-900 text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-primary/20">-{discountPercent}% OFF</span>}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
          <div className="text-[10px] text-primary-400 mb-1 uppercase tracking-[0.2em] font-bold">{product.category}</div>
          <h3 className="font-serif font-bold text-xl text-gray-800 mb-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
          
          <div className="flex items-center justify-between mt-auto pt-6">
              <div className="flex flex-col">
                  {hasPromo && <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>}
                  <span className={`text-2xl font-display font-medium ${hasPromo ? 'text-red-500' : 'text-gray-900'}`}>
                      {formatCurrency(finalPrice)}
                  </span>
              </div>
              <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="bg-primary-50 text-primary p-4 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm flex items-center justify-center"
              >
                  <ShoppingCart size={20} />
              </motion.button>
          </div>
      </div>
    </motion.div>
  );
};

// Promotional Bento Grid
const PromotionalBento: React.FC = () => {
  return (
    <section className="py-24 container mx-auto px-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
        {/* Large Feature */}
        <motion.div 
          whileHover={{ scale: 0.99 }}
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.9 }}
          className="md:col-span-2 md:row-span-2 bg-pastel-pink rounded-[2.5rem] p-10 flex flex-col justify-end relative overflow-hidden group border border-primary/5"
        >
          <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
          <div className="relative z-10">
            <span className="text-white text-xs font-bold uppercase tracking-widest mb-2 block">Oferta Especial</span>
            <h3 className="text-4xl font-serif font-bold text-white mb-4">Coleção Primavera</h3>
            <p className="text-white/80 max-w-sm mb-6">Cores suaves e texturas delicadas para o seu dia a dia.</p>
            <button className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary-50 transition">Comprar Tudo</button>
          </div>
        </motion.div>

        {/* Medium Top */}
        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          className="md:col-span-2 bg-primary-100 rounded-[2rem] p-8 flex items-center justify-between overflow-hidden group border border-primary/5"
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">Planners 2025</h3>
            <p className="text-primary-700 text-sm mb-4">Organização é a chave do sucesso.</p>
            <button className="text-primary-900 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">Ver Mais <ArrowRight size={16} /></button>
          </div>
          <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400" className="w-40 h-40 object-cover rounded-2xl rotate-6 group-hover:rotate-0 transition-transform duration-500 shadow-xl" />
        </motion.div>

        {/* Small Buttons/Features */}
        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          className="bg-accent/40 rounded-[2rem] p-8 flex flex-col justify-center border border-primary/5"
        >
          <div className="text-primary-900 text-xl font-bold font-serif mb-1 uppercase tracking-tighter">Até 40%</div>
          <div className="text-primary-600 text-sm mb-4 italic">Na seção de Outlet</div>
          <div className="w-12 h-1 border-t-2 border-primary-900"></div>
        </motion.div>

        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 20 }}
          className="bg-pastel-blue rounded-[2rem] p-8 flex items-center justify-center text-center overflow-hidden relative group border border-primary/5"
        >
          <div className="relative z-10">
            <h4 className="font-serif font-bold text-lg text-primary-900">Papéis Especiais</h4>
            <p className="text-xs text-primary-700">Gramaturas variadas</p>
          </div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        </motion.div>

      </div>
    </section>
  );
};

const Storefront: React.FC<StorefrontProps> = ({ onAddToCart, onViewProduct, useMockData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (useMockData) {
        setProducts(INITIAL_PRODUCTS);
        setCategories(INITIAL_CATEGORIES);
      } else {
        const prodData = await fetchProducts();
        const catData = await fetchCategories();
        setProducts(prodData.length === 0 ? INITIAL_PRODUCTS : prodData);
        setCategories(catData.length === 0 ? INITIAL_CATEGORIES : catData);
      }
      setLoading(false);
    };
    loadData();
  }, [useMockData]);

  const RANDOM_CATEGORY_IMAGES = [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400'
  ];
  const getRandomImage = (index: number) => RANDOM_CATEGORY_IMAGES[index % RANDOM_CATEGORY_IMAGES.length];
  const BG_COLORS = ['bg-pastel-pink', 'bg-pastel-blue', 'bg-pastel-purple', 'bg-pastel-green', 'bg-pastel-yellow'];

  return (
    <div className="pb-20 bg-[#fcfaf7]">
      <ShippingBar />

      {/* Hero Parallax Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
              src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?auto=format&fit=crop&q=80&w=1920" 
              className="w-full h-full object-cover opacity-30" 
          />
        </motion.div>
        
        <motion.div 
          style={{ opacity, y: y2 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.span 
            initial={{ opacity: 0, tracking: '0.2em' }} 
            animate={{ opacity: 1, tracking: '0.5em' }}
            className="text-primary-600 font-bold uppercase mb-8 block font-sans text-sm"
          >
            Nova Coleção 2025
          </motion.span>
          <h1 className="text-7xl md:text-[8rem] font-display font-medium text-primary-900 leading-[0.85] mb-10">
            Inspire sua <br/> <span className="italic serif text-accent font-serif">Criatividade</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-primary-800 transition flex items-center gap-3 group"
            >
              Comprar Agora <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={20} /></motion.div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="bg-white/50 backdrop-blur-md text-primary-900 border border-primary/10 px-10 py-5 rounded-full font-bold shadow-lg hover:bg-white"
            >
              Ver Catálogo
            </motion.button>
          </div>
        </motion.div>

        {/* Abstract Floating Elements */}
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-32 h-32 bg-pastel-pink/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[10%] w-48 h-48 bg-pastel-blue/40 rounded-full blur-3xl"
        />
      </section>

      {/* Promotional Bento Section */}
      <PromotionalBento />

      {/* Categories Section */}
      <section className="py-24 bg-white/50 rounded-[4rem] mx-4 border border-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium text-gray-900 mb-4">Nossas Coleções</h2>
            <div className="w-16 h-1 bg-accent mx-auto"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
              {categories.map((cat, idx) => {
                  const imgUrl = cat.image_url && cat.image_url.length > 5 ? cat.image_url : getRandomImage(idx);
                  const bgColor = BG_COLORS[idx % BG_COLORS.length];
                  
                  return (
                  <motion.div 
                    key={cat.id || idx} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-6 group cursor-pointer"
                  >
                      <div className={`w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl transition-all duration-500 group-hover:shadow-2xl ${bgColor}`}>
                           <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 opacity-90" />
                      </div>
                      <span className="font-serif font-bold text-xl text-primary-900 group-hover:text-primary transition-colors italic">{cat.name}</span>
                  </motion.div>
              )})}
          </div>
        </div>
      </section>

      {/* Featured Grid Section */}
      <div className="container mx-auto px-6 py-32" id="produtos">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
            <div className="max-w-xl">
                <span className="text-primary-400 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Os Queridinhos</span>
                <h2 className="text-5xl font-display font-medium text-gray-900">Mais Vendidos da Semana</h2>
            </div>
            <button className="bg-primary-900 text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition text-sm">Ver Todos os Produtos</button>
        </div>

        {loading ? (
             <div className="flex flex-col items-center justify-center p-20 gap-4">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-t-2 border-primary rounded-full" />
               <p className="text-gray-400 font-serif italic">Preparando o encanto...</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewProduct={onViewProduct} index={idx} />
            ))}
            </div>
        )}
      </div>

      {/* Chat Widget Replaces Simple Link */}
      <ChatWidget />

      {/* Footer Design Heavy */}
      <footer className="bg-primary-900 text-white py-24 rounded-t-[5rem]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
              <div className="md:col-span-5">
                  <div className="text-5xl font-display font-medium mb-8">Papelaria <br/> <span className="text-accent italic">Encantada</span></div>
                  <p className="text-primary-200 text-lg max-w-sm mb-8 leading-relaxed">
                    Nossa missão é transformar sua rotina em momentos de criatividade e inspiração através de produtos cuidadosamente selecionados.
                  </p>
                  <div className="flex gap-4">
                    {/* Social icons placeholder */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-900 transition cursor-pointer">IG</div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-900 transition cursor-pointer">PT</div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-primary-900 transition cursor-pointer">TT</div>
                  </div>
              </div>
              
              <div className="md:col-span-2">
                  <h4 className="font-serif font-bold text-lg mb-6 text-accent italic">Menu</h4>
                  <ul className="text-primary-200 space-y-4 text-sm font-medium">
                      <li className="hover:text-white cursor-pointer transition">Início</li>
                      <li className="hover:text-white cursor-pointer transition">Nossos Produtos</li>
                      <li className="hover:text-white cursor-pointer transition">Sobre Nós</li>
                      <li className="hover:text-white cursor-pointer transition">Blog do Encanto</li>
                  </ul>
              </div>

              <div className="md:col-span-2">
                  <h4 className="font-serif font-bold text-lg mb-6 text-accent italic">Suporte</h4>
                  <ul className="text-primary-200 space-y-4 text-sm font-medium">
                      <li className="hover:text-white cursor-pointer transition">Entrega</li>
                      <li className="hover:text-white cursor-pointer transition">Trocas</li>
                      <li className="hover:text-white cursor-pointer transition">Privacidade</li>
                      <li className="hover:text-white cursor-pointer transition">Contatos</li>
                  </ul>
              </div>
              
              <div className="md:col-span-3">
                  <h4 className="font-serif font-bold text-lg mb-6 text-accent italic">Newsletter</h4>
                  <p className="text-primary-200 text-xs mb-6 uppercase tracking-widest leading-relaxed">Assine para receber novidades e cupons exclusivos.</p>
                  <div className="flex bg-white/5 rounded-full p-2 border border-white/10 group focus-within:border-accent transition">
                      <input type="email" placeholder="Seu e-mail" className="bg-transparent px-4 w-full outline-none text-sm text-white" />
                      <button className="bg-accent text-primary-900 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white transition">Assinar</button>
                  </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-primary-400 text-xs uppercase tracking-[0.2em]">© 2026 Papelaria Encantada • Direitos Reservados</p>
                <div className="flex gap-4 opacity-50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 object-contain brightness-0 invert" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 object-contain brightness-0 invert" alt="Mastercard" />
                </div>
            </div>
          </div>
      </footer>
    </div>
  );
};

export default Storefront;