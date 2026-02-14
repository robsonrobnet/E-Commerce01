import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wand2, Loader2, X, AlertCircle, Upload, Star, DollarSign, Image as ImageIcon } from 'lucide-react';
import { Product } from '../types';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/supabaseService';
import { generateProductDescription } from '../services/geminiService';
import { INITIAL_PRODUCTS } from '../lib/constants';

interface AdminProductsProps {
  useMockData: boolean;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ useMockData }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    promotional_price: undefined,
    cost_price: undefined,
    stock: 0,
    description: '',
    image_url: 'https://picsum.photos/400/400',
    images: [],
    featured: false
  });

  // Local state for image management
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    if (useMockData) {
      setProducts(INITIAL_PRODUCTS);
    } else {
      const data = await fetchProducts();
      if (data.length === 0) {
          setProducts(INITIAL_PRODUCTS); 
      } else {
          setProducts(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMockData]);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      
      const imgs = (product.images && product.images.length > 0) ? product.images : [product.image_url];
      setLocalImages(imgs);
      setImageUrlInput('');
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: 0,
        promotional_price: undefined,
        cost_price: undefined,
        stock: 0,
        description: '',
        image_url: '',
        images: [],
        featured: false
      });
      setLocalImages([]);
      setImageUrlInput('');
    }
    setIsModalOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert("Preencha o nome e a categoria antes de gerar a descrição.");
      return;
    }
    setAiLoading(true);
    try {
      const description = await generateProductDescription(formData.name, formData.category);
      setFormData(prev => ({ ...prev, description }));
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setLocalImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim().length > 5) {
      setLocalImages(prev => [...prev, imageUrlInput]);
      setImageUrlInput('');
    }
  };

  const handleSetMainImage = (index: number) => {
    const newImages = [...localImages];
    const selected = newImages.splice(index, 1)[0];
    newImages.unshift(selected); // Move to start
    setLocalImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    setLocalImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure there's at least one image
    const processedImages = localImages.length > 0 ? localImages : ['https://picsum.photos/400/400'];
    const mainImage = processedImages[0];

    const finalData = {
      ...formData,
      images: processedImages,
      image_url: mainImage,
      // Ensure prices are numbers
      price: Number(formData.price),
      promotional_price: formData.promotional_price ? Number(formData.promotional_price) : null,
      cost_price: formData.cost_price ? Number(formData.cost_price) : null,
      stock: Number(formData.stock)
    };

    if (useMockData) {
      alert("Operações de escrita desabilitadas no modo Demo (sem banco conectado).");
      setIsModalOpen(false);
      return;
    }

    // Since types might conflict with null/undefined handling in Supabase vs TypeScript, cast as any for the generic update/create wrapper if needed, 
    // but our service expects Partial<Product>.
    if (editingProduct) {
      await updateProduct(editingProduct.id, finalData as Partial<Product>);
    } else {
      await createProduct(finalData as Product);
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      if (useMockData) {
         alert("Exclusão simulada (sem banco conectado).");
         setProducts(products.filter(p => p.id !== id));
      } else {
        await deleteProduct(id);
        loadData();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-primary">Gestão de Produtos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 shadow-md transition"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={40} /></div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-pastel-pink bg-opacity-30 text-gray-700">
              <tr>
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover border border-gray-200" />
                    <div>
                        <div className="font-medium text-gray-800">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                    {product.featured && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Destaque</span>}
                  </td>
                  <td className="p-4">
                     <div className="flex flex-col">
                        {product.promotional_price ? (
                            <>
                                <span className="text-xs text-gray-400 line-through">R$ {product.price.toFixed(2)}</span>
                                <span className="font-bold text-green-600">R$ {product.promotional_price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="font-bold text-gray-800">R$ {product.price.toFixed(2)}</span>
                        )}
                        {product.cost_price && (
                            <span className="text-[10px] text-gray-400">Custo: R$ {product.cost_price.toFixed(2)}</span>
                        )}
                     </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} un
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-blue-50 text-blue-600 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="p-8 text-center text-gray-500">Nenhum produto encontrado.</p>}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white border-b sticky top-0 z-10">
              <h3 className="text-2xl font-serif font-bold text-gray-800">{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              
              {/* Section 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Produto</label>
                  <input 
                    required 
                    className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none shadow-sm transition" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="Ex: Caneta Gel Preta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                  <input 
                    required 
                    className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none shadow-sm transition" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    placeholder="Ex: Escrita"
                  />
                </div>
              </div>

              {/* Section 2: Pricing & Stock */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <DollarSign size={16}/> Precificação e Estoque
                 </h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Preço "De" (Normal)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                            <input 
                                required 
                                type="number" 
                                step="0.01" 
                                className="w-full bg-white border border-gray-300 pl-8 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-green-600 mb-1">Preço "Por" (Promo)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">R$</span>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="w-full bg-green-50 border border-green-200 pl-8 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-green-700 font-bold" 
                                value={formData.promotional_price || ''} 
                                onChange={e => setFormData({...formData, promotional_price: e.target.value ? parseFloat(e.target.value) : undefined})} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Custo (Interno)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-300 text-sm">R$</span>
                            <input 
                                type="number" 
                                step="0.01" 
                                className="w-full bg-gray-50 border border-gray-200 pl-8 p-2 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none text-gray-500" 
                                value={formData.cost_price || ''} 
                                onChange={e => setFormData({...formData, cost_price: e.target.value ? parseFloat(e.target.value) : undefined})} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Estoque Atual</label>
                        <input 
                            required 
                            type="number" 
                            className="w-full bg-white border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                            value={formData.stock} 
                            onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                        />
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="rounded text-primary focus:ring-primary" />
                        <span className="text-sm font-medium text-gray-700">Destacar este produto na vitrine</span>
                    </label>
                 </div>
              </div>

              {/* Section 3: Description */}
              <div>
                <div className="flex justify-between items-end mb-2">
                   <label className="block text-sm font-bold text-gray-700">Descrição Comercial</label>
                   <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={aiLoading}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold bg-purple-50 px-3 py-1.5 rounded-full transition"
                   >
                     {aiLoading ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />}
                     Gerar com Inteligência Artificial
                   </button>
                </div>
                <textarea 
                    rows={4} 
                    className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none shadow-sm" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              {/* Section 4: Image Manager */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <ImageIcon size={16}/> Galeria de Imagens
                 </h4>
                 
                 {/* Input Area */}
                 <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary transition cursor-pointer relative">
                        <Upload size={24} className="mb-2"/>
                        <span className="text-sm font-bold">Upload de Arquivo</span>
                        <span className="text-xs">Clique para selecionar</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                         <label className="text-xs font-bold text-gray-500">Ou adicione por URL:</label>
                         <div className="flex gap-2">
                             <input 
                                className="flex-1 bg-white border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="https://..."
                                value={imageUrlInput}
                                onChange={(e) => setImageUrlInput(e.target.value)}
                             />
                             <button type="button" onClick={handleAddImageUrl} className="bg-gray-100 hover:bg-gray-200 px-4 rounded-lg font-bold text-gray-600">+</button>
                         </div>
                    </div>
                 </div>

                 {/* Gallery Grid */}
                 {localImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {localImages.map((img, idx) => (
                            <div key={idx} className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition ${idx === 0 ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}>
                                <img src={img} className="w-full h-full object-cover bg-gray-50" alt={`Prod ${idx}`} />
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                    {idx !== 0 && (
                                        <button 
                                            type="button" 
                                            onClick={() => handleSetMainImage(idx)}
                                            className="bg-white text-yellow-500 p-1.5 rounded-full shadow-lg hover:scale-110 transition"
                                            title="Definir como Principal"
                                        >
                                            <Star size={16} fill="currentColor"/>
                                        </button>
                                    )}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveImage(idx)}
                                        className="bg-white text-red-500 p-1.5 rounded-full shadow-lg hover:scale-110 transition"
                                        title="Remover"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                                {idx === 0 && <span className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Principal</span>}
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">Nenhuma imagem adicionada.</div>
                 )}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t bg-gray-50 sticky bottom-0 z-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-gray-300 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">Cancelar</button>
                <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-opacity-90 shadow-lg transition transform hover:-translate-y-0.5">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
