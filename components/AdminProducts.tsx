import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wand2, Loader2, X, AlertCircle } from 'lucide-react';
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
    stock: 0,
    description: '',
    image_url: 'https://picsum.photos/400/400',
    images: [],
    featured: false
  });

  // State local for textarea of multiple images
  const [imagesText, setImagesText] = useState('');

  const loadData = async () => {
    setLoading(true);
    if (useMockData) {
      setProducts(INITIAL_PRODUCTS);
    } else {
      const data = await fetchProducts();
      // Fallback to mock if DB empty for demo purposes
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
      // Populate textarea with images, or fallback to single image
      const imgs = (product.images && product.images.length > 0) ? product.images : [product.image_url];
      setImagesText(imgs.join('\n'));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        image_url: 'https://picsum.photos/400/400',
        images: [],
        featured: false
      });
      setImagesText('https://picsum.photos/400/400');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process images textarea to array
    const processedImages = imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    // Use the first image as the main image_url for backwards compatibility
    const mainImage = processedImages.length > 0 ? processedImages[0] : 'https://picsum.photos/400/400';

    const finalData = {
      ...formData,
      images: processedImages,
      image_url: mainImage
    };

    if (useMockData) {
      alert("Operações de escrita desabilitadas no modo Demo (sem banco conectado).");
      setIsModalOpen(false);
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, finalData);
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
                <th className="p-4">Categoria</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Estoque</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium text-gray-800">{product.name}</span>
                    {product.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Destaque</span>}
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-bold text-gray-800">R$ {product.price.toFixed(2)}</td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input required className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <input required className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <input required type="number" step="0.01" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estoque</label>
                  <input required type="number" className="w-full border p-2 rounded" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
                </div>
                 <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                    <span className="text-sm font-medium">Destaque</span>
                  </label>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                   <label className="block text-sm font-medium">Descrição</label>
                   <button 
                    type="button" 
                    onClick={handleGenerateDescription}
                    disabled={aiLoading}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-bold bg-purple-50 px-2 py-1 rounded"
                   >
                     {aiLoading ? <Loader2 className="animate-spin" size={12} /> : <Wand2 size={12} />}
                     Gerar com IA
                   </button>
                </div>
                <textarea rows={4} className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex justify-between">
                  <span>URLs das Imagens (Carrossel)</span>
                  <span className="text-xs text-gray-500">Uma URL por linha</span>
                </label>
                <textarea 
                  className="w-full border p-2 rounded text-sm font-mono" 
                  rows={4} 
                  value={imagesText} 
                  onChange={e => setImagesText(e.target.value)} 
                  placeholder="https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
                />
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {imagesText.split('\n').filter(u => u.length > 5).map((url, idx) => (
                      <img key={idx} src={url.trim()} alt="Preview" className="h-16 w-16 object-cover rounded border bg-gray-50" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;