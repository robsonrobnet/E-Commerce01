import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, ShieldCheck, Truck, CreditCard, ChevronLeft, ChevronRight, Star, Share2 } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onAddToCart, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = (product.images && product.images.length > 0) ? product.images : [product.image_url];
  
  // Use product details if available, otherwise fallback to defaults or generate basic info
  const longDescription = product.details?.long_description || product.description;
  
  const benefits = product.details?.benefits || [
    { title: "Qualidade Garantida", desc: "Produto selecionado por especialistas." },
    { title: "Entrega em SP", desc: "Envio rápido para toda a capital." },
    { title: "Compra Segura", desc: "Dados protegidos de ponta a ponta." }
  ];

  const specs = product.details?.specs || [
    { label: "Categoria", value: product.category },
    { label: "Disponibilidade", value: product.stock > 0 ? "Em Estoque" : "Sob Encomenda" }
  ];

  // Pricing Logic
  const hasPromo = product.promotional_price && product.promotional_price < product.price;
  const currentPrice = product.promotional_price || product.price;
  const discountPercent = hasPromo ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  const installments = 3;
  const installmentValue = (currentPrice / installments).toFixed(2);

  const nextImage = () => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="bg-white min-h-screen pb-20 animate-fade-in">
      {/* Breadcrumb / Navigation */}
      <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-500 sticky top-0 bg-white/95 backdrop-blur z-20 border-b border-gray-100 shadow-sm">
        <button onClick={onBack} className="hover:text-primary flex items-center gap-1 font-bold">
          <ArrowLeft size={16} /> Voltar
        </button>
        <span>/</span>
        <span className="uppercase tracking-wider font-bold text-xs">{product.category}</span>
        <span>/</span>
        <span className="text-gray-800 font-bold truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
              <img 
                src={images[currentImageIndex]} 
                alt={`${product.name} - Vista Principal`} 
                className="w-full h-full object-cover transition duration-500 hover:scale-105"
              />
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100 z-10"><ChevronLeft size={20}/></button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:bg-white transition opacity-0 group-hover:opacity-100 z-10"><ChevronRight size={20}/></button>
                </>
              )}
              {product.featured && <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Destaque SP</div>}
              {hasPromo && <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">-{discountPercent}% OFF</div>}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${currentImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Info & Purchase */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
               <span className="bg-pastel-pink text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
               <span className="text-xs text-gray-400 font-medium">Ref: {product.id.slice(0,8)}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            {/* Reviews Mock */}
            <div className="flex items-center gap-2 mb-6">
               <div className="flex text-yellow-400">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
               </div>
               <span className="text-sm text-gray-500 font-medium hover:text-primary cursor-pointer border-b border-dashed border-gray-400 hover:border-primary transition">(Ver 128 avaliações)</span>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 mb-8 shadow-sm">
               {hasPromo && (
                 <p className="text-gray-400 text-sm mb-1 line-through">De: R$ {product.price.toFixed(2)}</p>
               )}
               <div className="flex items-end gap-2 mb-2">
                  <span className={`text-4xl font-bold ${hasPromo ? 'text-red-600' : 'text-primary'}`}>
                      R$ {currentPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-bold mb-1 bg-green-50 px-2 py-0.5 rounded">5% OFF no PIX</span>
               </div>
               <div className="text-sm text-gray-600 flex items-center gap-2">
                  <CreditCard size={16} />
                  <span>Em até <strong>{installments}x de R$ {installmentValue}</strong> sem juros</span>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} /> Adicionar à Sacola
              </button>
              <button className="p-4 rounded-xl border-2 border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition">
                <Heart size={24} />
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-blue-100 transition">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Truck size={20}/></div>
                  <div className="text-sm">
                     <p className="font-bold text-gray-800">Frete Expresso SP</p>
                     <p className="text-xs text-gray-500">Receba em até 24h*</p>
                  </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-green-100 transition">
                  <div className="p-2 bg-green-50 text-green-600 rounded-full"><ShieldCheck size={20}/></div>
                  <div className="text-sm">
                     <p className="font-bold text-gray-800">Garantia Total</p>
                     <p className="text-xs text-gray-500">Satisfação ou reembolso</p>
                  </div>
               </div>
            </div>

            {/* Short Description */}
            <div className="prose text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
               <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">Sobre o Produto</h3>
               <p className="line-clamp-3 leading-relaxed text-sm">{product.description}</p>
               <button onClick={() => document.getElementById('full-desc')?.scrollIntoView({ behavior: 'smooth'})} className="text-primary font-bold text-sm hover:underline mt-2 flex items-center gap-1">
                  Ler tudo <ChevronRight size={12}/>
               </button>
            </div>
          </div>
        </div>

        {/* Detailed Content Section (SEO Heavy) */}
        <div id="full-desc" className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Description */}
           <div className="lg:col-span-2 space-y-10">
              <div className="animate-slide-up">
                 <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Descrição Detalhada</h2>
                 <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg space-y-4">
                    {longDescription}
                 </div>
                 <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 rounded-r-lg">
                    <strong>Dica de Papelaria:</strong> Combine este item com nossa coleção de {product.category === 'Cadernos' ? 'canetas gel' : 'organizadores'} para um setup de estudos perfeito.
                 </div>
              </div>

              <div>
                 <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">Especificações Técnicas</h2>
                 <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left text-gray-600">
                        <tbody className="divide-y divide-gray-100">
                           {specs.map((spec, i) => (
                               <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                                   <th className="p-4 font-bold text-gray-700 w-1/3">{spec.label}</th>
                                   <td className="p-4">{spec.value}</td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                 </div>
              </div>
           </div>

           {/* Benefits Sidebar */}
           <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                 <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" /> Por que escolher?
                 </h3>
                 <div className="space-y-6">
                    {benefits.map((benefit, idx) => (
                       <div key={idx} className="flex gap-4 group">
                          <div className="w-10 h-10 rounded-full bg-pastel-pink text-primary flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-110 transition shadow-sm">
                             {idx + 1}
                          </div>
                          <div>
                             <h4 className="font-bold text-gray-800 group-hover:text-primary transition">{benefit.title}</h4>
                             <p className="text-sm text-gray-600 leading-snug">{benefit.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-600 mb-3 text-center">Compartilhe esse achado:</p>
                    <div className="flex gap-3 justify-center">
                       <button className="p-3 bg-gray-50 rounded-full shadow-sm hover:text-green-600 hover:bg-green-50 transition"><Share2 size={20}/></button>
                       <button className="p-3 bg-gray-50 rounded-full shadow-sm hover:text-blue-600 hover:bg-blue-50 transition"><Share2 size={20}/></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;