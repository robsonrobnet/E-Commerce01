import React, { useState } from 'react';
import { Image, Upload, Trash2, Eye } from 'lucide-react';

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState([
    { id: 1, type: 'Hero Principal', url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a6?auto=format&fit=crop&q=80&w=1600', active: true },
    { id: 2, type: 'Destaque Central', url: 'https://images.unsplash.com/photo-1506784926709-b2f9752fc184?auto=format&fit=crop&q=80&w=800', active: true },
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-primary">Layout e Banners</h2>
      <p className="text-gray-500">Personalize a aparência da sua loja virtual.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Banner List */}
         <div className="space-y-6">
            {banners.map(banner => (
               <div key={banner.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                     <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-xs">{banner.type}</span>
                     <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-500"><Eye size={18} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                     </div>
                  </div>
                  <div className="h-40 rounded-lg overflow-hidden bg-gray-50 relative group">
                     <img src={banner.url} alt="Banner" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <button className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold text-sm">Alterar Imagem</button>
                     </div>
                  </div>
               </div>
            ))}
            
            <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:border-primary hover:text-primary transition flex items-center justify-center gap-2 font-bold">
               <Upload size={20} /> Adicionar Novo Banner
            </button>
         </div>

         {/* Preview / Config */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Configuração de Cores</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm text-gray-600 mb-1">Cor Primária</label>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-primary border border-gray-200"></div>
                     <span className="text-sm font-mono">#6B4C74</span>
                     <button className="text-xs text-blue-500 hover:underline">Editar</button>
                  </div>
               </div>
               <div>
                  <label className="block text-sm text-gray-600 mb-1">Cor de Fundo (Hero)</label>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-lg bg-pastel-pink border border-gray-200"></div>
                     <span className="text-sm font-mono">#FDE2E4</span>
                     <button className="text-xs text-blue-500 hover:underline">Editar</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminBanners;