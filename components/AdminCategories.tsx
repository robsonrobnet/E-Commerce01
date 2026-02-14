import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Category } from '../types';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/supabaseService';
import { INITIAL_CATEGORIES } from '../lib/constants';

interface AdminCategoriesProps {
  useMockData: boolean;
}

const AdminCategories: React.FC<AdminCategoriesProps> = ({ useMockData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    image_url: ''
  });

  const loadData = async () => {
    setLoading(true);
    if (useMockData) {
      setCategories(INITIAL_CATEGORIES);
    } else {
      const data = await fetchCategories();
      if (data.length === 0) {
        setCategories(INITIAL_CATEGORIES);
      } else {
        setCategories(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMockData]);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useMockData) {
      alert("Operações de escrita desabilitadas no modo Demo.");
      setIsModalOpen(false);
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await createCategory(formData as Category);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      if (useMockData) {
         alert("Exclusão simulada (sem banco conectado).");
         setCategories(categories.filter(c => c.id !== id));
      } else {
        await deleteCategory(id);
        loadData();
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-serif font-bold text-primary">Categorias</h2>
           <p className="text-gray-500">Gerencie as categorias exibidas na loja.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 shadow-md transition"
        >
          <Plus size={20} /> Nova Categoria
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition">
               <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                     <button onClick={() => handleOpenModal(cat)} className="p-2 bg-white text-blue-600 rounded-full hover:bg-gray-100"><Edit size={16}/></button>
                     <button onClick={() => handleDelete(cat.id)} className="p-2 bg-white text-red-600 rounded-full hover:bg-gray-100"><Trash2 size={16}/></button>
                  </div>
               </div>
               <div className="p-4 flex items-center justify-between">
                  <span className="font-bold text-gray-800">{cat.name}</span>
               </div>
            </div>
          ))}
          
          {categories.length === 0 && <p className="col-span-4 text-center py-10 text-gray-400">Nenhuma categoria cadastrada.</p>}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Categoria</label>
                <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Cadernos" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                <div className="flex gap-2">
                   <div className="flex-1">
                     <input required className="w-full border p-2 rounded" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                   </div>
                   <div className="w-10 h-10 border rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                      {formData.image_url ? <img src={formData.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
                   </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;