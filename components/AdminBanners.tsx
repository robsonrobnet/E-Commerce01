import React, { useState } from 'react';
import { Image, Upload, Trash2, Eye, Layout, Type, Palette, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState([
    { id: 1, type: 'Hero Principal', title: 'Inspire sua Criatividade', subtitle: 'Nova Coleção 2025', url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?auto=format&fit=crop&q=80&w=1600', active: true },
    { id: 2, type: 'Destaque Central', title: 'Kit Planner Essencial', subtitle: 'Edição Limitada', url: 'https://images.unsplash.com/photo-1506784926709-b2f9752fc184?auto=format&fit=crop&q=80&w=800', active: true },
  ]);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-display font-medium text-primary-900 italic serif">Configurador de Layout</h2>
          <p className="text-gray-500 font-medium">Gerencie o visual da sua vitrine e banners promocionais.</p>
        </div>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-primary-900 transition flex items-center gap-2">
            <Upload size={18} /> Novo Elemento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Banner List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-4 text-primary font-bold uppercase tracking-widest text-xs">
                <Layout size={16} /> Banners Ativos
            </div>
            
            {banners.map(banner => (
               <motion.div 
                key={banner.id} 
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 relative overflow-hidden group"
               >
                  <div className="w-full md:w-64 h-40 rounded-2xl overflow-hidden bg-gray-50 shrink-0 relative">
                     <img src={banner.url} alt="Banner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-primary bg-primary-50 px-3 py-1 rounded-full uppercase tracking-widest">{banner.type}</span>
                          <h4 className="text-xl font-serif font-bold text-gray-800 mt-2 italic">{banner.title}</h4>
                        </div>
                        <div className="flex gap-1">
                           <button className="p-2 text-gray-400 hover:text-primary transition bg-gray-50 rounded-full"><Eye size={16} /></button>
                           <button className="p-2 text-gray-400 hover:text-red-500 transition bg-gray-50 rounded-full"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <p className="text-sm text-gray-500 mb-4">{banner.subtitle}</p>
                     
                     <div className="flex gap-3">
                        <button className="text-xs font-bold text-primary border border-primary/20 bg-primary-50 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition">Editar Conteúdo</button>
                        <button className="text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-xl border border-transparent hover:border-gray-300 transition">Trocar Imagem</button>
                     </div>
                  </div>
               </motion.div>
            ))}
            
            <button className="w-full border-2 border-dashed border-gray-200 rounded-[2rem] p-10 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary-50 transition flex flex-col items-center justify-center gap-3 font-bold group">
               <div className="p-4 bg-gray-50 rounded-full group-hover:bg-primary group-hover:text-white transition"><Upload size={24} /></div>
               Adicionar Nova Seção Visual
            </button>
         </div>

         {/* Visual Branding Config */}
         <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4 text-primary font-bold uppercase tracking-widest text-xs">
                <Palette size={16} /> Identidade Visual
            </div>
            
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
               <h3 className="font-display text-2xl font-medium text-gray-900 italic serif mb-4">Configuração Global</h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Paleta de Cores</label>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl group cursor-pointer hover:bg-white border border-transparent hover:border-primary/10 transition">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary shadow-sm"></div>
                              <div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase">Primária</p>
                                 <p className="font-mono text-sm font-bold text-gray-700">#6B4C74</p>
                              </div>
                           </div>
                           <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50">
                     <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tipografia</label>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-primary">
                           <div className="flex items-center gap-3">
                              <Type className="text-primary" size={20} />
                              <div>
                                 <p className="text-sm font-bold text-gray-800">Serif & Elegante</p>
                                 <p className="text-[10px] text-gray-400">Libre Baskerville + Inter</p>
                              </div>
                           </div>
                           <div className="w-4 h-4 rounded-full border-[5px] border-primary"></div>
                        </div>
                     </div>
                  </div>
               </div>
               
               <button className="w-full bg-primary-900 text-white py-4 rounded-2xl font-bold hover:bg-primary transition shadow-xl mt-6">Publicar Alterações</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminBanners;
